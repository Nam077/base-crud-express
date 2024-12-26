import { Request, Response, NextFunction } from "express";
import { Service } from "typedi";
import { Logger } from "../services/logger.service";

interface RequestWithTimer extends Request {
  startTime?: number;
}

@Service()
export class ResponseLoggerMiddleware {
  constructor(private readonly logger: Logger) {}

  use() {
    return (req: RequestWithTimer, res: Response, next: NextFunction) => {
      req.startTime = Date.now();

      // Store original response methods
      const originalJson = res.json;
      const originalSend = res.send;

      // Override response methods
      res.json = function (body: any): Response {
        this.locals.body = body;
        return originalJson.call(this, body);
      };

      res.send = function (body: any): Response {
        this.locals.body = body;
        return originalSend.call(this, body);
      };

      // Log after response is sent
      res.on("finish", () => {
        const logData = {
          method: req.method,
          url: req.originalUrl,
          status: res.statusCode,
          responseTime: Date.now() - (req.startTime || Date.now()),
          // body: res.locals.body,
          userAgent: req.headers["user-agent"],
          ip: req.ip,
        };

        if (res.statusCode >= 400) {
          this.logger.error("API Response Error", logData);
        } else {
          this.logger.info("API Response", logData);
        }
      });

      next();
    };
  }
}
