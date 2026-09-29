import React from "react";

/**
 * Renders the small Markdown subset AI replies use: paragraphs, bullet and numbered lists,
 * **bold** and *italic*. Builds React elements (never raw HTML), so model output can't inject markup.
 */

const INLINE = /(\*\*[^*]+\*\*|\*[^*\s][^*]*\*)/g;

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(INLINE).map((part, i) => {
    const key = `${keyPrefix}-${i}`;
    if (part.startsWith("**") && part.endsWith("**") && part.length > 4) {
      return <strong key={key} className="font-semibold">{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }
    return <React.Fragment key={key}>{part}</React.Fragment>;
  });
}

const BULLET = /^\s*[-*•]\s+/;
const NUMBERED = /^\s*\d+[.)]\s+/;

export function MessageText({ text, className = "" }: { text: string; className?: string }) {
  const blocks: React.ReactNode[] = [];
  const lines = text.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }

    const listType = BULLET.test(line) ? "ul" : NUMBERED.test(line) ? "ol" : null;
    if (listType) {
      const marker = listType === "ul" ? BULLET : NUMBERED;
      const items: string[] = [];
      while (i < lines.length && marker.test(lines[i])) {
        items.push(lines[i].replace(marker, ""));
        i++;
      }
      const ListTag = listType;
      blocks.push(
        <ListTag key={`b${blocks.length}`} className={`${listType === "ul" ? "list-disc" : "list-decimal"} pl-5 space-y-1`}>
          {items.map((item, j) => (
            <li key={j}>{renderInline(item, `l${blocks.length}-${j}`)}</li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Consecutive non-list lines form one paragraph (single newlines kept as line breaks)
    const paragraph: string[] = [];
    while (i < lines.length && lines[i].trim() && !BULLET.test(lines[i]) && !NUMBERED.test(lines[i])) {
      paragraph.push(lines[i]);
      i++;
    }
    blocks.push(
      <p key={`b${blocks.length}`}>
        {paragraph.map((l, j) => (
          <React.Fragment key={j}>
            {j > 0 && <br />}
            {renderInline(l, `p${blocks.length}-${j}`)}
          </React.Fragment>
        ))}
      </p>
    );
  }

  return <div className={`space-y-2 ${className}`}>{blocks}</div>;
}
