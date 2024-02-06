import { IOrder, OrderStatus } from "@interfaces/order.interface";
import createBaseSchema, { createModel } from "./base.model";
import { Schema } from "mongoose";

const orderSchema = createBaseSchema({
  productId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Product",
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  costPerItem: {
    type: Number,
    required: true,
    min: 1,
  },
  discountInPer: {
    type: Number,
    required: false,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  failedReason: {
    type: String,
    required: false,
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.PENDING,
  },
});

const OrderModel = createModel<IOrder>("Order", orderSchema);

export default OrderModel;
