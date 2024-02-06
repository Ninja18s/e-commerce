import { AccessForbiddenError } from "./api-errors/access.forbidden.error";
import { BadRequestError } from "./api-errors/bad.request.error";
import { InternalServerError } from "./api-errors/internal.server.error";
import { NotAuthorizedError } from "./api-errors/not.authorized.error";
import { NotFoundError } from "./api-errors/not.found.error";
import { PreconditionError } from "./api-errors/precondition.failed";
import { UnprocessableEntity } from "./api-errors/unprocessable.entity.error";

export  {
  BadRequestError,
  AccessForbiddenError,
  NotAuthorizedError,
  NotFoundError,
  InternalServerError,
  PreconditionError,
  UnprocessableEntity,
};

export const errorClassObj = {
  400: BadRequestError,
  403: AccessForbiddenError,
  401: NotAuthorizedError,
  404: NotFoundError,
  412: PreconditionError,
  422: UnprocessableEntity,
  500: InternalServerError,
};
