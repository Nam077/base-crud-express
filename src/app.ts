import "reflect-metadata";
import express, { Application } from "express";
import { useExpressServer, useContainer } from "routing-controllers";
import { Container } from "typedi";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { EnvConfig } from "./configs/env.config";
import { DatabaseConfig } from "./configs/database.config";
import { routingConfig } from "./configs/routing.config";
import os from "os";
import { ResponseLoggerMiddleware } from "./middlewares/response-logger.middleware";
import { ValidationMiddleware } from "./middlewares/validation.middleware";

const getLocalIP = () => {
  const interfaces = os.networkInterfaces();
  for (const iface of Object.values(interfaces)) {
    for (const details of iface || []) {
      if (details.family === "IPv4" && !details.internal) {
        return details.address;
      }
    }
  }
  return "localhost";
};

export class App {
  private static instance: App;
  private readonly app: Application;
  private readonly env: EnvConfig;

  private constructor() {
    this.app = express();
    this.env = EnvConfig.getInstance();
    this.setupDI();
    this.setupMiddlewares();
    this.setupRouting();
  }

  private setupDI(): void {
    useContainer(Container);
  }

  private setupMiddlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));

    const responseLogger = Container.get<ResponseLoggerMiddleware>(
      ResponseLoggerMiddleware
    );
    this.app.use(responseLogger.use());
  }

  private setupRouting(): void {
    useExpressServer(this.app, routingConfig);
  }

  public static getInstance(): App {
    if (!App.instance) {
      App.instance = new App();
    }
    return App.instance;
  }

  public async start(): Promise<void> {
    try {
      await DatabaseConfig.getInstance().initialize();

      this.app.listen(this.env.port, () => {
        console.log(
          `Server is running at
          http://localhost:${this.env.port}
          http://${getLocalIP()}:${this.env.port}`
        );
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }
}
