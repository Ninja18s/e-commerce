export interface IOrder {
  productId: string;
  quantity: number;
  costPerItem: number; // In Rs * 100;
  discountInPer: number;
  status?: OrderStatus;
  failedReason?: string;
    userId: string;
    totalAmount?: number;
}

export enum OrderStatus {
  PENDING = "pending",
  IN_PROGRESS = "in-progress",
  COMPLETED = "completed",
  FAILED = "failed",
}
