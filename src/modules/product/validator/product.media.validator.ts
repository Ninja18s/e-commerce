import Joi from "joi";
import { MediaType } from "@interfaces/product.media.interface";

const mediaTypeSchema = Joi.string().valid(...Object.values(MediaType));

const mediaSchema = Joi.object({
  url: Joi.string().required(),
  mediaType: mediaTypeSchema.required(),
  isVisible: Joi.boolean().required()
});

export const mediaArraySchema = Joi.array().items(mediaSchema);
