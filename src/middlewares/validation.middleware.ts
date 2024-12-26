import {
  Middleware,
  ExpressErrorMiddlewareInterface,
} from "routing-controllers";
import { ValidationError } from "class-validator";
import { Service } from "typedi";

@Service()
@Middleware({ type: "after" })
export class ValidationMiddleware implements ExpressErrorMiddlewareInterface {
  error(error: any, request: any, response: any, next: (err?: any) => any) {
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
