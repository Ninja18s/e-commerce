import { ErrorHandler } from "./custom.api.error";

export function AccessForbiddenError(message: string | undefined) {
  return new ErrorHandler(403, message || "Access denied");
}
