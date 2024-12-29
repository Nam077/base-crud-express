import { Middleware, ExpressMiddlewareInterface } from "routing-controllers";
import { Service } from "typedi";
import { NotFoundException } from "@/exceptions/http.exception";
import { Request, Response } from "express";
@Service()
@Middleware({ type: "after" })
export class NotFoundMiddleware implements ExpressMiddlewareInterface {
  use(_request: Request, response: Response, next: (err?: any) => any): void {
    if (!response.headersSent) {
      throw new NotFoundException("Route not found");
    }
    next();
  }
}
