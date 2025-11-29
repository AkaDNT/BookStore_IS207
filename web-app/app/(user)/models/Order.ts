import { OrderItem } from "./OrderItem";
import { Payment } from "./Payment";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | string;

export interface Order {
  orderId: number;
  orderCode: string;
  email: string;

  orderItems: OrderItem[];

  orderDate: string;
  createdAt: string | null;
  paidAt: string | null;

  totalAmount: number;
  orderStatus: string;
  paymentStatus: PaymentStatus | null;

  addressId: number;
  payment: Payment;
}
