import { OrderStatus } from "@interfaces/order.interface";
import { BadRequestError } from "@utils/errors";
import { validateObjectId } from "@utils/validation";
import Joi from "joi";
import { ComparisonType, SortType } from "../interface/order.interface";

export const orderSchema = Joi.object({
  productId: Joi.string().required(),
  quantity: Joi.number().integer().min(1).required(),
  discountInPer: Joi.number().min(0).max(100).required(),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(OrderStatus))
    .required(),
});
export const idSchema = Joi.object({
  productId: Joi.string()
    .custom((value: string, handlers) => {
      const isValidId = validateObjectId(value);
      if (!isValidId) {
        throw BadRequestError("Invalid id");
      }
      return value;
    })
    .required(),
});

const comparisonSchema = Joi.object({
  value: Joi.alternatives(Joi.string(), Joi.number()).required(),
  condition: Joi.valid(...Object.values(ComparisonType)).required(),
});


const orderFilterSchema = Joi.object({
  userId: Joi.string(),
  productId: Joi.string(),
  totalAmount: Joi.array().items(comparisonSchema),
  createdAt: Joi.array().items(comparisonSchema),
});

const orderSortSchema = Joi.object({
  quantity: Joi.valid(...Object.values(SortType)).optional(),
  costPerItem: Joi.valid(...Object.values(SortType)).optional(),
  discountInPer: Joi.valid(...Object.values(SortType)).optional(),
  totalAmount:Joi.valid(...Object.values(SortType)).optional(),
  status: Joi.valid(...Object.values(SortType)).optional(),
});
const paginationSchema = Joi.object({
  nextId: Joi.string(),
  nextCreatedAt: Joi.string(),
  hasMore: Joi.boolean(),
});

export const getPaginatedOrdersByFilterSchema = Joi.object({
  productId: Joi.string(),
  filter: orderFilterSchema.optional(),
  sort: orderSortSchema.optional(),
  pagination: paginationSchema.optional(),
});
