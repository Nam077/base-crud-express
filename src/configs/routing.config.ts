import { RoutingControllersOptions } from "routing-controllers";
import { UsersController } from "../controllers/v1/users.controller";
import { ValidationMiddleware } from "../middlewares/validation.middleware";
import { ErrorMiddleware } from "../middlewares/error.middleware";

export const routingConfig: RoutingControllersOptions = {
  cors: true,
  routePrefix: "/api",
  controllers: [UsersController],
  middlewares: [ValidationMiddleware, ErrorMiddleware],
  validation: {
    whitelist: true,
    forbidNonWhitelisted: true,
    forbidUnknownValues: true,
    validationError: {
      target: false,
      value: false,
    },
  },
  defaultErrorHandler: false,
  classTransformer: true,
};
