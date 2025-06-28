import { NextApiRequest, NextApiResponse } from "next";
import {
  BaseError,
  ForbiddenError,
  InternalServerError,
  MethodNotAllowedError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "./errors";

function onNoMatch(request: NextApiRequest, response: NextApiResponse) {
  const error = new MethodNotAllowedError(request.method);
  return response.status(error.statusCode).json(error);
}

function onError(
  error: BaseError,
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (isInternalServerError(error)) {
    const internalError = new InternalServerError({
      cause: error,
    });
    response.status(internalError.statusCode).json(internalError);
  }
  response.status(error.statusCode).json(error);
}

function isInternalServerError(error: BaseError) {
  if (
    error instanceof ValidationError ||
    error instanceof UnauthorizedError ||
    error instanceof NotFoundError ||
    error instanceof ForbiddenError
  ) {
    return false;
  }
  return true;
}
const controller = {
  onNoMatch,
  onError,
};

export default controller;
