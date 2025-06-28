type ErrorParams = {
  message?: string;
  action?: string;
  cause?: Error;
};

export class BaseError extends Error {
  name: string;
  message: string;
  statusCode: number;
  action: string;

  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statusCode,
    };
  }
}

export class MethodNotAllowedError extends BaseError {
  constructor(method: string) {
    super(`Method "${method}" not allowed for this endpoint`);
    this.name = "MethodNotAllowedError";
    this.action = "Check if this HTTP method is valid for this endpoint";
    this.statusCode = 405;
  }
}
export class UnauthorizedError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(message || "User is not authenticated", {
      cause,
    });
    this.name = "UnauthorizedError";
    this.action = action || "Log in to get access";
    this.statusCode = 401;
  }
}

export class ForbiddenError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(message || "You have no permission for this action", {
      cause,
    });
    this.name = "ForbiddenError";
    this.action = action || "Check your permissions";
    this.statusCode = 403;
  }
}

export class ValidationError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(message || "An error has ocurred when validating data", {
      cause,
    });
    this.name = "ValidationError";
    this.action = action || "Check if the data is correct";
    this.statusCode = 400;
  }
}
export class NotFoundError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(message || "The content cannot be found", {
      cause,
    });
    this.name = "NotFoundError";
    this.action = action || "Check parameters are being sended correctly";
    this.statusCode = 404;
  }
}

export class InternalServerError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(
      message || "An internal error has ocurred, please, try again later.",
      {
        cause,
      },
    );
    this.name = "InternalServerError";
    this.action = action || "Contact support team for more details";
    this.statusCode = 500;
  }
}

export class ServiceError extends BaseError {
  constructor({ message, action, cause }: ErrorParams = {}) {
    super(message || "A service is not working correctly", {
      cause,
    });
    this.name = "ServiceError";
    this.action = action || "Check if this service is available";
    this.statusCode = 503;
  }
}
