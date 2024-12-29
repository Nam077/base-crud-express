import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { ValidationError } from "class-validator";
import { Service } from "typedi";
import { Request, Response, NextFunction } from "express";
@Service()
@Middleware({ type: "after" })
export class ValidationMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: (err?: any) => NextFunction) {
    console.log("Validation Error:", error);

    if (Array.isArray(error) && error[0] instanceof ValidationError) {
      const validationErrors = error.map((e: ValidationError) => ({
        property: e.property,
        constraints: e.constraints,
      }));

      return response.status(400).json({
        status: 400,
        message: "Validation failed",
        errors: validationErrors,
      });
    }
    next(error);
  }
}
