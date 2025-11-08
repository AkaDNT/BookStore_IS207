import { Book } from "./Book";

export interface OrderItem {
  title: string;
  author: string;
  orderItemId: number;
  book: Book;
  quantity: number;
  discount: number;
  orderedBookPrice: number;
  imageUrl: string;
}
