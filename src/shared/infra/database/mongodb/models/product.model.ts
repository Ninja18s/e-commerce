import { Schema } from "mongoose";
import createBaseSchema, { createModel } from "./base.model";
import { IProduct, ProductCategory } from "@interfaces/product.interface";

const productSchema = createBaseSchema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  availability: {
    type: Number,
    required: true,
    min: 0,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  category: {
    type: String,
    enum: Object.values(ProductCategory),
    required: true,
    lowercase: true,
  },
  keyFeatures: {
    type: Map,
    of: String,
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
productSchema.virtual("media", {
  ref: "ProductMedia",
  localField: "_id",
  foreignField: "productId",

  justOne: false,
  options: {
    match: { isVisible: true },
    sort: { position: 1 },
    select: { url: 1, mediaType: 1, position: 1, _id: 1 },
  },
});

productSchema.set("toObject", {
  virtuals: true,
});
productSchema.set("toJSON", {
  virtuals: true,
});

productSchema.index({ name: 1, price: 1, category: 1 });

const ProductModel = createModel<IProduct>("Product", productSchema);

export default ProductModel;
