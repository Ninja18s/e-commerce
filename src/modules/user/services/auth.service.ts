import UserModel from "@infra/database/mongodb/models/user.model";
import { IUser } from "@interfaces/user.interface";
import GetUserService from "./get.user.service";
import { BadRequestError, NotAuthorizedError } from "@utils/errors";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import config from "@setup/config";
import { Auth } from "../interface/auth.interface";



class AuthService {
  constructor(private readonly getUserService = GetUserService) {}
  async registerUser(user: IUser) {
    const checkUser = await this.getUserService.getUserByPhoneOrEmail({
      phone: user.phone,
      email: user.email,
      countryCode: user.countryCode,
    });
    if (checkUser) {
      let message: string;
      if (checkUser.email === user.email) {
        message = "User already registered with email!";
      } else {
        message = "User already registered with phone";
      }
      throw BadRequestError(message);
    }
    const newUser = new UserModel(user);
    await newUser.save();
    return newUser;
  }

  async login({ email, phone, countryCode, password }: Auth) {
    const getUser = await this.getUserService.getUserByPhoneOrEmail({
      phone,
      email,
      countryCode,
    });
    if (!getUser) {
      throw NotAuthorizedError("Invalid username or password");
    }

    const token = await this.validateUserAndGenerateToken(getUser, password);

    return {
      user: {
        ...getUser,
        token,
      },
    };
  }

  private async validateUserAndGenerateToken(
    user: IUser,
    password: string
  ): Promise<string> {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw NotAuthorizedError("Invalid username or password.");
    }

    const token = jwt.sign(
      {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      config.secretKey,
      {
        expiresIn: "7D",
      }
    );

    return token;
  }
}

export default new AuthService();
