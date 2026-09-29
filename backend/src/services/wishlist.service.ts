import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
import { Product } from "../types/product.types.js";
import { productInclude, toProduct } from "./product.service.js";

export interface WishlistEntry {
  id: string;
  productId: string;
  addedAt: string;
  product: Product;
}

export class WishlistService {
  private async getWishlistId(userId: string): Promise<string> {
    const wishlist = await prisma.wishlist.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });
    return wishlist.id;
  }

  async getWishlist(userId: string): Promise<WishlistEntry[]> {
    const wishlistId = await this.getWishlistId(userId);
    const rows = await prisma.wishlistItem.findMany({
      where: { wishlistId },
      include: { product: { include: productInclude } },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      addedAt: r.createdAt.toISOString(),
      product: toProduct(r.product),
    }));
  }

  async addItem(userId: string, productId: string): Promise<WishlistEntry[]> {
    const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
    if (!product) throw new HttpError(404, `Product ${productId} not found`);
    const wishlistId = await this.getWishlistId(userId);
    await prisma.wishlistItem.upsert({
      where: { wishlistId_productId: { wishlistId, productId } },
      update: {},
      create: { wishlistId, productId },
    });
    return this.getWishlist(userId);
  }

  async removeItem(userId: string, productId: string): Promise<WishlistEntry[]> {
    const wishlistId = await this.getWishlistId(userId);
    await prisma.wishlistItem.deleteMany({ where: { wishlistId, productId } });
    return this.getWishlist(userId);
  }

  async clear(userId: string): Promise<WishlistEntry[]> {
    const wishlistId = await this.getWishlistId(userId);
    await prisma.wishlistItem.deleteMany({ where: { wishlistId } });
    return [];
  }

  /** Adds a guest (browser) wishlist to the user's saved wishlist after login. */
  async merge(userId: string, productIds: string[]): Promise<WishlistEntry[]> {
    const wishlistId = await this.getWishlistId(userId);
    const known = await prisma.product.findMany({ where: { id: { in: productIds } }, select: { id: true } });
    await prisma.wishlistItem.createMany({
      data: known.map((p) => ({ wishlistId, productId: p.id })),
      skipDuplicates: true,
    });
    return this.getWishlist(userId);
  }
}

export const wishlistService = new WishlistService();
