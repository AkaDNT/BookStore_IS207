import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";

export interface Order {
  orderId: number;
  email: string;
  orderItems: OrderItem[];
  orderDate: Date;
  payment: Payment;
  totalAmount: number;
  orderStatus: string;
  addressId: number;
}
