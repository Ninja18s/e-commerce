import { ErrorHandler } from "./custom.api.error";

export function NotAuthorizedError(message: string | undefined) {
  return new ErrorHandler(401, message || "Not Authorized");
}
