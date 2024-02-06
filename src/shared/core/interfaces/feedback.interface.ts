export interface IFeedback {
  productId: string;
  userId: string;
  rating?: number;
  review?: string;
  isItemPurchased?: boolean;
}
