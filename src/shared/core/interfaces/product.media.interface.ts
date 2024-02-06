export interface IProductMedia {
  productId: string;
  url: string;
  mediaType: MediaType;
  position: number;
  isVisible: boolean;
}

export enum MediaType {
  IMAGE = "image",
  VIDEO = "video",
}
