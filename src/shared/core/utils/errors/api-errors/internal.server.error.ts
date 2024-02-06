import { ErrorHandler } from "./custom.api.error";

export function InternalServerError(message: string | undefined) {
  return new ErrorHandler(500, message || "Internal Server Error");
}
