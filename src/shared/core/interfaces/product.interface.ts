import { MediaType } from "./product.media.interface";

export type IMedia = {
  url: string;
  mediaType: MediaType;
  isVisible: boolean;
};

export interface IProduct {
  name: string;
  availability: number;
  description: string;
  price: number; // In Rs * 100;
  category: ProductCategory;
  keyFeatures?: { [key: string]: string };
  createdBy?: string;
  updatedBy?: string;
  media?: Array<IMedia>;
}

export enum ProductCategory {
  ELECTRONICS = "electronics",
  HOME_APPLIANCES = "home-appliances",
  CLOTHING_AND_APPAREL = "clothing-and-apparel",
  COSMETICS = "cosmetics",
  TOYS_AND_GAMES = "toys-and-games",
  BOOKS_AND_MEDIA = "books-and-media",
  FOOD_AND_GROCERIES = "food-and-groceries",
  STATIONERY = "stationery",
  OTHER = "other",
}
