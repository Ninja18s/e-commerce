import { IProductMedia, MediaType } from "@interfaces/product.media.interface";
import createBaseSchema, { createModel } from "./base.model";
import { Schema } from "mongoose";

const productMediaSchema = createBaseSchema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  mediaType: {
    type: String,
    enum: Object.values(MediaType),
    required: true,
    default: MediaType.IMAGE,
  },
  url: {
    type: String,
    required: true,
  },
  position: {
    type: Number,
    required: true,
    index: true,
  },
  isVisible: {
    type: Boolean,
    default: true,
  },
});

const ProductMediaModel = createModel<IProductMedia>(
  "ProductMedia",
  productMediaSchema
);

export default ProductMediaModel;
