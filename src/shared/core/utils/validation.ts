import { parsePhoneNumber } from "libphonenumber-js";
import { Types } from "mongoose";
export const validateEmail = (email: string): boolean => {
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
  return re.test(email.toLowerCase());
};

export const validateNumber = (phone: string): boolean => {
  const re = /^\d+$/;
  return re.test(phone);
};

export const validateStrongPassword = (password: string): boolean => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  return strongPasswordRegex.test(password);
};

export const validatePhone = (phone: string, countryCode: string): boolean => {
  if (!countryCode.startsWith("+")) {
    countryCode = `+${countryCode}`;
  }
  const parsedNumber = parsePhoneNumber(countryCode + phone);
  return parsedNumber.isValid();
};

export const validateObjectId = (id: string): boolean => {
  return Types.ObjectId.isValid(id);
};
