import { Prisma } from "@prisma/client";
import { prisma } from "../config/database.js";
import { Product, ProductFilters } from "../types/product.types.js";

const productInclude = { category: true } satisfies Prisma.ProductInclude;
type ProductRow = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function toProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand,
    category: row.category?.name ?? "Uncategorized",
    price: Number(row.price),
    originalPrice: row.originalPrice != null ? Number(row.originalPrice) : undefined,
    discount: row.discount ?? undefined,
    rating: row.rating,
    reviewCount: row.reviewCount,
    image: row.image,
    images: row.images,
    description: row.description,
    specifications: (row.specifications ?? {}) as Record<string, string>,
    features: row.features,
    availability: row.availability === "out-of-stock" ? "out-of-stock" : "in-stock",
    tags: row.tags,
    matchScore: row.matchScore ?? undefined,
    aiPros: row.aiPros,
    aiCons: row.aiCons,
  };
}

export class ProductService {
  async getProducts(filters?: ProductFilters): Promise<Product[]> {
    const where: Prisma.ProductWhereInput = {};

    if (filters?.category && filters.category !== "All Categories") {
      where.category = { name: { equals: filters.category, mode: "insensitive" } };
    }

    if (filters?.minPrice !== undefined || filters?.maxPrice !== undefined) {
      where.price = { gte: filters.minPrice, lte: filters.maxPrice };
    }

    if (filters?.minRating !== undefined) {
      where.rating = { gte: filters.minRating };
    }

    if (filters?.availability && filters.availability !== "all") {
      where.availability = filters.availability;
    }

    if (filters?.search) {
      const q = filters.search.trim();
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { brand: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
        { tags: { has: q.toLowerCase() } },
      ];
    }

    let orderBy: Prisma.ProductOrderByWithRelationInput[] = [{ matchScore: { sort: "desc", nulls: "last" } }];
    if (filters?.sortBy === "price-low") orderBy = [{ price: "asc" }];
    else if (filters?.sortBy === "price-high") orderBy = [{ price: "desc" }];
    else if (filters?.sortBy === "rating") orderBy = [{ rating: "desc" }];
    else if (filters?.sortBy === "popularity") orderBy = [{ reviewCount: "desc" }];

    const rows = await prisma.product.findMany({ where, orderBy, include: productInclude });
    return rows.map(toProduct);
  }

  async getAllProducts(): Promise<Product[]> {
    return this.getProducts();
  }

  async getProductById(id: string): Promise<Product | null> {
    const row = await prisma.product.findUnique({ where: { id }, include: productInclude });
    return row ? toProduct(row) : null;
  }

  async getProductsByIds(ids: string[]): Promise<Product[]> {
    const rows = await prisma.product.findMany({ where: { id: { in: ids } }, include: productInclude });
    return rows.map(toProduct);
  }

  async searchProducts(query: string): Promise<Product[]> {
    return this.getProducts({ search: query });
  }
}

export const productService = new ProductService();
export { productInclude };
