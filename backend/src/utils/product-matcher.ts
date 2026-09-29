import { Product } from "../types/product.types.js";

/**
 * Fuzzy "which product is the user talking about?" matching.
 *
 * Each word of a product name is weighted: model words like "macbook", "s24", "xm5" count most,
 * the brand counts less, and generic words ("pro", "ultra", "wireless", bare numbers) count least.
 * A product only matches when the message names something specific about it, so
 * "apple" alone matches nothing, but "apple watch" or "macbook air" does.
 */

const GENERIC_WORDS = new Set([
  "pro", "ultra", "air", "plus", "max", "mini", "lite", "go", "slim", "edition", "gen", "2nd",
  "wireless", "anc", "oled", "inch", "usb", "console", "camera", "mirrorless", "keyboard",
  "custom", "mechanical", "robot", "vacuum", "mop", "hot", "cool", "omni", "watch", "tab",
  "the", "and", "with", "for", "of",
]);

// Common shorthand -> words that appear in the catalog names
const ALIASES: Record<string, string[]> = {
  ps5: ["playstation", "5"],
  playstation5: ["playstation", "5"],
  qc: ["quietcomfort"],
  airpod: ["airpods"],
  xps16: ["xps", "16"],
};

const SEGMENT_SEPARATOR = /\b(?:vs\.?|versus|or|and|against|compared\s+(?:to|with)|with)\b|[,&/]/i;

const WEIGHT = { distinctive: 3, brand: 2, generic: 1 };
const MIN_SCORE = 3;

/** Lowercase word tokens; hyphenated words also yield their joined form ("wh-1000xm5" -> "wh1000xm5"). */
export function tokenize(text: string): string[] {
  const tokens = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9+-]+/)) {
    if (!raw) continue;
    const parts = raw.split(/[-+]/).filter(Boolean);
    for (const p of parts) if (p.length >= 2) tokens.add(p);
    if (parts.length > 1) tokens.add(parts.join(""));
  }
  return [...tokens];
}

function queryTokens(text: string): Set<string> {
  const tokens = new Set<string>();
  for (const t of tokenize(text)) {
    tokens.add(t);
    for (const alias of ALIASES[t] ?? []) tokens.add(alias);
  }
  return tokens;
}

/** Name word is mentioned exactly, or a model code is given partially ("xm5" for "1000xm5"). */
function isMentioned(nameToken: string, query: Set<string>): boolean {
  if (query.has(nameToken)) return true;
  if (!/\d/.test(nameToken)) return false;
  for (const q of query) {
    if (q.length >= 3 && q !== nameToken && (nameToken.endsWith(q) || nameToken.startsWith(q))) return true;
  }
  return false;
}

export interface ProductMatch {
  product: Product;
  score: number;
}

/** All products the text refers to, best match first. */
export function matchProducts(text: string, catalog: Product[]): ProductMatch[] {
  const query = queryTokens(text);
  if (query.size === 0) return [];

  const brandCounts = new Map<string, number>();
  for (const p of catalog) brandCounts.set(p.brand.toLowerCase(), (brandCounts.get(p.brand.toLowerCase()) ?? 0) + 1);

  const matches: (ProductMatch & { coverage: number })[] = [];
  for (const product of catalog) {
    const brandTokens = new Set(tokenize(product.brand));
    const nameTokens = new Set([...tokenize(product.name), ...brandTokens]);

    let score = 0;
    let matched = 0;
    let brandMatched = false;
    let distinctiveMatched = false;

    for (const token of nameTokens) {
      if (!isMentioned(token, query)) continue;
      matched++;
      if (brandTokens.has(token)) {
        brandMatched = true;
        score += WEIGHT.brand;
      } else if (GENERIC_WORDS.has(token) || /^\d+$/.test(token)) {
        score += WEIGHT.generic;
      } else {
        distinctiveMatched = true;
        score += WEIGHT.distinctive;
      }
    }

    // A brand with only one product in the catalog identifies it on its own ("bose", "dyson")
    const uniqueBrand = brandMatched && brandCounts.get(product.brand.toLowerCase()) === 1;
    const accepted = uniqueBrand || (score >= MIN_SCORE && (distinctiveMatched || brandMatched));
    if (accepted) {
      matches.push({ product, score: Math.max(score, MIN_SCORE), coverage: matched / nameTokens.size });
    }
  }

  return matches
    .sort((a, b) => b.score - a.score || b.coverage - a.coverage)
    .map(({ product, score }) => ({ product, score }));
}

/**
 * Products explicitly mentioned in the text, at most `limit`, in the order the user named them.
 * Splits on "vs", "or", "and", commas so "iPhone 15 Pro vs Galaxy S24" matches one product per side.
 */
export function findMentionedProducts(text: string, catalog: Product[], limit = 2): Product[] {
  const found: Product[] = [];
  const add = (p: Product | undefined) => {
    if (p && !found.some((f) => f.id === p.id) && found.length < limit) found.push(p);
  };

  const segments = text.split(SEGMENT_SEPARATOR).map((s) => s?.trim()).filter(Boolean);
  if (segments.length > 1) {
    for (const segment of segments) add(matchProducts(segment, catalog)[0]?.product);
    // Each side of "A vs B" already named its product; don't pad with looser whole-sentence matches
    if (found.length >= 2) return found;
  }
  for (const m of matchProducts(text, catalog)) add(m.product);

  return found;
}
