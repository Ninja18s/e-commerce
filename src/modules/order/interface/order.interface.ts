
export interface OrderFilter {
  userId?: string;
  productId?: string;
  totalAmount?: Comparison[];
  createdAt?: Comparison[];
}

export enum ComparisonType {
  LessThen = 0,
  EqualTo = 1,
  GreaterThen = 2,
}

export const ComparisonTypeOperation =['$lt', '$eq', '$gt']

export interface Comparison {
  value: string | number;
  condition: ComparisonType;
}

export enum SortType {
  ASC = 1,
  DESC = -1,
}

export interface OrderSort {
  quantity?: SortType;
  costPerItem?: SortType;
  discountInPer?: SortType;
  status?: SortType;
}

export interface ICreateOrder {
  quantity: number;
  costPerItem: number; // In Rs * 100;
  discountInPer: number;
}
