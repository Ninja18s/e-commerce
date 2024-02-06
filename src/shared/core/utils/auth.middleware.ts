import { NextFunction, Request, Response } from "express";
import { NotAuthorizedError } from "./errors";
import { IGetRequestUser } from "../types/express";
import verifyJwt from "./jwt.handler";

export default function authMiddleware() {
  return async function (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const bearerToken = req.headers["authorization"];
      if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
        throw NotAuthorizedError("Missing or invalid token");
      }

      const tokenValue = bearerToken.split(" ")[1];
      if (!tokenValue) {
        throw NotAuthorizedError("Missing or invalid token");
      }

      const decodedData = verifyJwt(tokenValue);
      req.user = {
        ...decodedData,
        id: decodedData._id,
      } as IGetRequestUser;

      next();
    } catch (error) {
      next(error);
    }
  };
}
