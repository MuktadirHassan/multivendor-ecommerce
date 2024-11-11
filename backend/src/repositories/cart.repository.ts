import { Cart, CartItem } from "@prisma/client";
import { BaseRepository } from "../types/repository";

export interface ICartRepository extends BaseRepository<Cart> {
  findByUser(userId: number): Promise<(Cart & { items: CartItem[] }) | null>;
  addItem(
    cartId: number,
    productId: number,
    quantity: number
  ): Promise<CartItem>;
  removeItem(cartId: number, itemId: number): Promise<boolean>;
  updateItemQuantity(itemId: number, quantity: number): Promise<CartItem>;
  clearCart(cartId: number): Promise<boolean>;
}
