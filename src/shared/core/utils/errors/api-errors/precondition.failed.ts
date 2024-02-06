import { ErrorHandler } from "./custom.api.error";

export function PreconditionError(message: string | undefined) {
  return new ErrorHandler(412, message || "Invalid Precondition");
}
