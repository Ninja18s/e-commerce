import { ProductCategory } from "@interfaces/product.interface";

export interface IProductFilter {
  rating?: IRange;
  price?: IRange;
  category?: ProductCategory;
  availability?: number;
  name?: string;
}

export interface IRange{
  min?: number;
  max?: number;
}
export enum SortType {
  ASC = 1,
  DESC = -1,
}

export interface IProductSort {
  rating?: SortType;
  price?: SortType;
  category?: SortType;
  availability?: SortType;
  name?: SortType;
  createdAt?: SortType;
}

export interface IProductPagination {
  hasMore?: boolean;
  skip?: number;
  limit?: number;
}
