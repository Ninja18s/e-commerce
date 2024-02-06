import Joi from "joi";

import { ProductCategory } from "@interfaces/product.interface";
import { validateObjectId } from "@utils/validation";
import { BadRequestError } from "@utils/errors";
import { mediaArraySchema } from "./product.media.validator";



export const productSchema = Joi.object({
  name: Joi.string().required(),
  availability: Joi.number().integer().min(0).required(),
  description: Joi.string().required(),
  price: Joi.number().integer().min(0).required(),
  category: Joi.string()
    .valid(...Object.values(ProductCategory))
    .required(),
  keyFeatures: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  media: mediaArraySchema.optional()
});

export const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  availability: Joi.number().integer().min(0).optional(),
  description: Joi.string().optional(),
  price: Joi.number().integer().min(0).optional(),
  category: Joi.string()
    .valid(...Object.values(ProductCategory))
    .optional(),
  keyFeatures: Joi.object().pattern(Joi.string(), Joi.string()).optional(),
  id: Joi.string()
    .custom((value: string, handlers) => {
      const isValidId = validateObjectId(value);
      if (!isValidId) {
        throw BadRequestError("Invalid id");
      }
      return value;
    })
    .required(),
});
