import { ErrorHandler } from "./custom.api.error";

export function BadRequestError(message: string | undefined) {
  return new ErrorHandler(400, message || "Bad Request");
}

