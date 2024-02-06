import createBaseSchema, { createModel } from "./base.model";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { IUser } from "@interfaces/user.interface";
import config from "@setup/config";
import {
  validateEmail,
  validateNumber,
  validateStrongPassword,
} from "@utils/validation";
const userSchema = createBaseSchema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: [validateEmail, "Please enter a valid email address"],
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: [validateNumber, "Phone number must contain only numbers"],
  },
  countryCode: {
    type: String,
    required: true,
    trim: true,
    validate: [validateNumber, "Country code must contain only numbers"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    validate: [
      validateStrongPassword,
      "Password must contain at least one Uppercase character, lowercase characters, one number and spacial character",
    ],
  },
});

userSchema.pre("save", function (next) {
  const countryCode = this.countryCode as string;
  const password = this.password as string;
  if (this.isModified("countryCode") || this.isNew) {
    if (countryCode && countryCode.startsWith("+")) {
      this.countryCode = countryCode.substring(1);
    }
  }
  if (this.isModified("password") || this.isNew) {
    const salt = bcrypt.genSaltSync(10);
    this.password = bcrypt.hashSync(password, salt);
  }

  next();
});



userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

userSchema.index({ phone: 1, countryCode: 1 }, { unique: true });

const UserModel =  createModel<IUser>("User", userSchema);

export default UserModel;
