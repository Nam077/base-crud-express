import {
  Middleware,
  ExpressErrorMiddlewareInterface,
  BadRequestError,
  HttpError,
} from "routing-controllers";
import { Service } from "typedi";
import { ValidationError } from "class-validator";
import { Logger } from "@/services/logger.service";
import { HttpException } from "@/exceptions/http.exception";

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
    ) => ({
      success: false,
      error: {
        code: status,
        message,
        ...(errors && { details: errors }),
      },
    });

    // Handle routing-controllers HttpError
    if (error instanceof HttpError) {
      return response
        .status(error.httpCode)
        .json(formatErrorResponse(error.httpCode, error.message));
    }

    // Handle our custom HttpException
    if (error instanceof HttpException) {
      return response
        .status(error.status)
        .json(formatErrorResponse(error.status, error.message, error.errors));
    }

    // Handle all other errors as system errors
    const systemError = {
      code: 500,
      message: "System Error",
      details: {
        systemMessage: "Internal Server Error"
      }
    };

    return response
      .status(500)
      .json({
        success: false,
        error: systemError
      });
  }
}
