import { prisma } from "../config/database.js";
import { HttpError } from "../utils/http-error.js";
import { Product } from "../types/product.types.js";
import { productInclude, toProduct } from "./product.service.js";
import { calculateSummary, PriceSummary } from "./pricing.js";

export const MAX_QUANTITY_PER_ITEM = 10;

export interface CartView {
  items: { id: string; productId: string; quantity: number; product: Product }[];
  summary: PriceSummary;
}

async function ensureProductExists(productId: string): Promise<void> {
  const product = await prisma.product.findUnique({ where: { id: productId }, select: { id: true } });
  if (!product) throw new HttpError(404, `Product ${productId} not found`);
}

export class CartService {
  private async getCartId(userId: string): Promise<string> {
    const cart = await prisma.cart.upsert({
      where: { userId },
      update: {},
      create: { userId },
      select: { id: true },
    });
    return cart.id;
  }

  async getCart(userId: string): Promise<CartView> {
    const cartId = await this.getCartId(userId);
    const rows = await prisma.cartItem.findMany({
      where: { cartId },
      include: { product: { include: productInclude } },
      orderBy: { createdAt: "asc" },
    });
    const items = rows.map((r) => ({
      id: r.id,
      productId: r.productId,
      quantity: r.quantity,
      product: toProduct(r.product),
    }));
    return {
      items,
      summary: calculateSummary(items.map((i) => ({ price: i.product.price, quantity: i.quantity }))),
    };
  }

  async addItem(userId: string, productId: string, quantity: number): Promise<CartView> {
    await ensureProductExists(productId);
    const cartId = await this.getCartId(userId);
    const existing = await prisma.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } } });
    const newQuantity = Math.min(MAX_QUANTITY_PER_ITEM, (existing?.quantity ?? 0) + quantity);
    await prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: newQuantity },
      create: { cartId, productId, quantity: newQuantity },
    });
    return this.getCart(userId);
  }

  async setQuantity(userId: string, productId: string, quantity: number): Promise<CartView> {
    const cartId = await this.getCartId(userId);
    if (quantity <= 0) {
      await prisma.cartItem.deleteMany({ where: { cartId, productId } });
    } else {
      await ensureProductExists(productId);
      const capped = Math.min(MAX_QUANTITY_PER_ITEM, quantity);
      await prisma.cartItem.upsert({
        where: { cartId_productId: { cartId, productId } },
        update: { quantity: capped },
        create: { cartId, productId, quantity: capped },
      });
    }
    return this.getCart(userId);
  }

  async removeItem(userId: string, productId: string): Promise<CartView> {
    return this.setQuantity(userId, productId, 0);
  }

  async clear(userId: string): Promise<CartView> {
    const cartId = await this.getCartId(userId);
    await prisma.cartItem.deleteMany({ where: { cartId } });
    return this.getCart(userId);
  }

  /**
   * Merges a guest (browser) cart into the user's saved cart after login.
   * Uses the larger quantity per product so logging in repeatedly never doubles items.
   */
  async merge(userId: string, items: { productId: string; quantity: number }[]): Promise<CartView> {
    const cartId = await this.getCartId(userId);
    const known = new Set(
      (await prisma.product.findMany({ where: { id: { in: items.map((i) => i.productId) } }, select: { id: true } })).map(
        (p) => p.id
      )
    );
    const existing = new Map(
      (await prisma.cartItem.findMany({ where: { cartId } })).map((i) => [i.productId, i.quantity])
    );

    await prisma.$transaction(
      items
        .filter((i) => known.has(i.productId))
        .map((i) => {
          const quantity = Math.min(MAX_QUANTITY_PER_ITEM, Math.max(existing.get(i.productId) ?? 0, i.quantity));
          return prisma.cartItem.upsert({
            where: { cartId_productId: { cartId, productId: i.productId } },
            update: { quantity },
            create: { cartId, productId: i.productId, quantity },
          });
        })
    );
    return this.getCart(userId);
  }
}

export const cartService = new CartService();
