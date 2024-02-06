// src/controllers/user.controller.ts
import { NextFunction, Request, Response } from "express";
import GetUserService from "../../../services/get.user.service";
import { IPagination } from "@utils/interface";
import AuthService from "@user/services/auth.service";
import { Auth } from "@user/interface/auth.interface";
import { IUser } from "@interfaces/user.interface";
import UpdateUserService from "@user/services/update.user.service";

class UserControllerV1 {
  constructor(
    private readonly getUserService = GetUserService,
    private readonly authService = AuthService,
    private readonly updateUserService = UpdateUserService
  ) {
    this.authService = authService
  }
  async getUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const pagination: IPagination = req.body.pagination || {};
      // const query
      res.locals.response = await this.getUserService.getPaginatedUsers(
        {},
        pagination
      );
      next();
    } catch (error) {
      next(error);
    }
  }

  async getUserById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      res.locals.response = await this.getUserService.getUserById(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async myProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.user!.id;
      res.locals.response = await this.getUserService.getUserById(id);
      next();
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const auth: Auth = req.body;
      res.locals.response = await this.authService.login(auth);
      next();
    } catch (error) {
      next(error);
    }
  }

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user: IUser = req.body;
      res.locals.response = await this.authService.registerUser(user);
      next();
    } catch (error) {
      next(error);
    }
  }

  async updateUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = req.user!.id
      const user: Partial<IUser> = req.body;
      res.locals.response = await this.updateUserService.update(id, user);
      next();
    } catch (error) {
      next(error);
    }
  }

}

export default new UserControllerV1();
