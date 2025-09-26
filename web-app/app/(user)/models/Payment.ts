export interface Payment {
  paymentId: number;
  paymentMethod: string;
  pgPaymentId: string;
  pgStatus: string;
  pgResponseMessage: string;
  pgName: string;
}
