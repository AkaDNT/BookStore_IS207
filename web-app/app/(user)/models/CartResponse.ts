import { CartItem } from "./CartItem";

export interface CartResponse {
  cartId: number;
  totalPrice: number;
  books: CartItem[];
}
