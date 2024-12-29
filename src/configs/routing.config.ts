import { ProductsController } from "@/controllers/v1/products.controller";
import { UsersController } from "@/controllers/v1/users.controller";
import { ErrorMiddleware } from "@/middlewares/error.middleware";
import { ValidationMiddleware } from "@/middlewares/validation.middleware";
import { NotFoundMiddleware } from "@/middlewares/not-found.middleware";
import { RoutingControllersOptions } from "routing-controllers";

export const routingConfig: RoutingControllersOptions = {
  cors: true,
  routePrefix: "/api",
  controllers: [UsersController, ProductsController],
  middlewares: [ValidationMiddleware, NotFoundMiddleware, ErrorMiddleware],
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
