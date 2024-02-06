import { BadRequestError } from "@utils/errors";
import { validateObjectId } from "@utils/validation";
import Joi from "joi";

export const feedbackSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().min(0).max(5),
  review: Joi.string(),
  isItemPurchased: Joi.boolean().optional(),
}).or("rating", "review");

export const updateFeedbackSchema = Joi.object({
  productId: Joi.string().required(),
  rating: Joi.number().min(0).max(5).optional(),
  review: Joi.string().optional(),
  isItemPurchased: Joi.boolean().optional(),
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

