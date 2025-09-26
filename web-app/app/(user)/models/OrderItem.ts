import { Book } from "./Book";

export interface OrderItem {
  orderItemId: number;
  book: Book;
  quantity: number;
  discount: number;
  orderedBookPrice: number;
}
