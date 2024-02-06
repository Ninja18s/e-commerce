import { ErrorHandler } from "./custom.api.error";

export function UnprocessableEntity(message: string | undefined) {
  return new ErrorHandler(422, message || "Unprocessable Entity");
}
