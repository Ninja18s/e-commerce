import Joi, { ObjectSchema } from "joi";
import {
  validateObjectId,
  validatePhone,
  validateStrongPassword,
} from "@utils/validation";
import { BadRequestError } from "@utils/errors";

export const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .min(9)
    .max(11)
    .regex(/^\d+$/)
    .required()
    .custom((value: string, handlers) => {
      const { phone, countryCode } = handlers.state.ancestors[0];
      const isValidPhone = validatePhone(phone, countryCode);
      if (!isValidPhone) {
        throw BadRequestError("Invalid phone");
      }
      return value;
    }),
  countryCode: Joi.string().min(1).max(3).regex(/^\d+$/).required(),
  password: Joi.string()
    .required()
    .custom((value: string, handlers) => {
      const isStrongPassword = validateStrongPassword(value);
      if (!isStrongPassword) {
        throw BadRequestError(`Use Strong password`);
      }

      return value;
    }),
});

export const loginSchema = Joi.object({
  email: Joi.string().email(),
  phone: Joi.string().min(9).max(11).regex(/^\d+$/).when("email", {
    is: Joi.exist(),
    then: Joi.optional(),
    otherwise: Joi.required(),
  }),
  countryCode: Joi.string().min(1).max(3).regex(/^\d+$/).when("phone", {
    is: Joi.string().required(),
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  password: Joi.string().required(),
}).xor("email", "phone");

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  phone: Joi.string()
    .min(9)
    .max(11)
    .regex(/^\d+$/)
    .optional()
    .custom((value: string, handlers) => {
      const { phone, countryCode } = handlers.state.parent;
      const isValidPhone = validatePhone(phone, countryCode);
      if (!isValidPhone) {
        throw BadRequestError(`Invalid phone`);
      }
      return value;
    }),
  countryCode: Joi.string().min(1).max(3).regex(/^\d+$/).optional(),
  password: Joi.string()
    .optional()
    .custom((value: string, handlers) => {
      const isStrongPassword = validateStrongPassword(value);
      if (!isStrongPassword) {
        throw BadRequestError(`Use Strong password`);
      }

      return value;
    }),
});

export const idSchema = Joi.object({
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
