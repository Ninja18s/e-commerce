import { CustomErrorInterface } from "@utils/errors/api-errors/custom.api.error";
import { NextFunction, Request, Response } from "express";
import winston from "winston";

interface IResponse {
  message: string;
  status: number;
  success: boolean;
  data?: { [key: string]: string } | [{ [key: string]: string }] | null;
}
export const onResponse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: IResponse = {
    message: "Success",
    status: 200,
    success: true,
    data: res.locals.response,
  };
  return res.status(200).json(response);
};

export const onError = (
  err: CustomErrorInterface,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  const response: IResponse = {
    message: err.message || "Something went wrong",
    status: err.status || 500,
    success: false,
  };

  res.status(err.status || 500).send(response);
};

const createLogger = (): winston.Logger =>
  winston.createLogger({
    level: "info",
    format: winston.format.json(),
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: "combined.log" }),
    ],
  });

const logger = createLogger();

export const loggingMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`Method: ${req.method}, Path: ${req.url}, Status:${res.statusCode}`);
  next();
};
