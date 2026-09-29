// Seeds the catalog from the web app's product data so IDs (lap-1, phone-1, …) match across apps.
// Run with: npm run db:seed --workspace=backend
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { PRODUCTS } from "../../apps/web/src/data/products";
import { CATEGORIES } from "../../apps/web/src/data/categories";

const prisma = new PrismaClient();

// Units given to in-stock products when first created (existing stock levels are never overwritten)
const INITIAL_STOCK = 25;

const DEMO_USER = {
  email: "demo@shopmind.ai",
  name: "Demo Shopper",
  password: "demo12345",
};

async function main() {
  console.log("[Database Seed] Seeding categories...");
  for (const c of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: { name: c.name, description: c.description, image: c.image },
      create: { id: c.id, name: c.name, slug: c.slug, description: c.description, image: c.image },
    });
  }

  const categoryIdByName = new Map(
    (await prisma.category.findMany()).map((c) => [c.name, c.id])
  );

  console.log("[Database Seed] Seeding products...");
  for (const p of PRODUCTS) {
    const data = {
      name: p.name,
      brand: p.brand,
      description: p.description,
      price: p.price,
      originalPrice: p.originalPrice ?? null,
      discount: p.discount ?? null,
      rating: p.rating,
      reviewCount: p.reviewCount,
      image: p.image,
      images: p.images ?? [p.image],
      specifications: p.specifications,
      features: p.features,
      availability: p.availability,
      tags: p.tags,
      matchScore: p.matchScore ?? null,
      aiPros: p.aiPros ?? [],
      aiCons: p.aiCons ?? [],
      categoryId: categoryIdByName.get(p.category) ?? null,
    };
    await prisma.product.upsert({
      where: { id: p.id },
      // Availability follows live stock once a product exists, so don't reset it
      update: { ...data, availability: undefined },
      create: { id: p.id, ...data, stock: p.availability === "in-stock" ? INITIAL_STOCK : 0 },
    });
  }

  console.log("[Database Seed] Seeding demo user...");
  const passwordHash = await bcrypt.hash(DEMO_USER.password, 10);
  await prisma.user.upsert({
    where: { email: DEMO_USER.email },
    update: {},
    create: { email: DEMO_USER.email, name: DEMO_USER.name, passwordHash },
  });

  console.log(
    `[Database Seed] Done: ${CATEGORIES.length} categories, ${PRODUCTS.length} products, demo login ${DEMO_USER.email} / ${DEMO_USER.password}`
  );
}

main()
  .catch((err) => {
    console.error("[Database Seed] Failed:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
