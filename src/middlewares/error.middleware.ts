import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  BadRequestError,
} from "routing-controllers";
import { Service } from "typedi";
import { Logger } from "../services/logger.service";
import { ValidationError } from "class-validator";
import { HttpException } from "../exceptions/http.exception";

interface ValidationErrorResponse extends BadRequestError {
  errors?: ValidationError[];
}

@Service()
@Middleware({ type: "after" })
export class ErrorMiddleware implements ExpressErrorMiddlewareInterface {
  constructor(private readonly logger: Logger) {}

  error(error: any, request: any, response: any, next: (err?: any) => any) {
    this.logger.error("Error details:", error);

    const formatErrorResponse = (
      status: number,
      message: string,
      errors?: any
    ) => {
      const errorResponse = {
        success: false,
        data: null,
        error: {
          code: status,
          message,
          ...(errors && { details: errors }),
        },
      };

      return errorResponse;
    };

    if (error instanceof HttpException) {
      return response
        .status(error.status)
        .json(formatErrorResponse(error.status, error.message, error.errors));
    }

    if (error instanceof BadRequestError) {
      const validationError = error as ValidationErrorResponse;
      if (validationError.errors?.length) {
        const validationErrors = validationError.errors.map(
          (e: ValidationError) => ({
            field: e.property,
            errors: Object.values(e.constraints || {}),
          })
        );

        return response
          .status(400)
          .json(
            formatErrorResponse(400, "Validation failed", validationErrors)
          );
      }
    }

    const status = error.httpCode || error.statusCode || 500;
    const message = error.message || "Internal server error";

    return response
      .status(status)
      .json(formatErrorResponse(status, message, error.errors));
  }
}
