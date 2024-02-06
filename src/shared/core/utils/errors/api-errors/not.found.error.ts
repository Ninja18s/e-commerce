import { ErrorHandler } from "./custom.api.error";

export function NotFoundError(message: string | undefined) {
  return new ErrorHandler(404, message || "Not Found");
}
