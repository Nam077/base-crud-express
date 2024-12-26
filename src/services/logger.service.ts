import { Service } from "typedi";
import chalk from "chalk";
import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import path from "path";

@Service()
export class Logger {
  private logger: winston.Logger;

  constructor() {
    const logDir = path.join(process.cwd(), "logs");

    this.logger = winston.createLogger({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
      ),
      transports: [
        new DailyRotateFile({
          dirname: logDir,
          filename: "application-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "14d",
          level: "info",
        }),
        new DailyRotateFile({
          dirname: logDir,
          filename: "error-%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: "14d",
          level: "error",
        }),
      ],
    });
  }

  info(message: string, meta?: any) {
    // Console log với màu sắc
    console.info(
      chalk.blue(`[INFO]`) + chalk.white(` ${message}`),
      meta ? chalk.gray(JSON.stringify(meta, null, 2)) : ""
    );

    // Ghi vào file
    this.logger.info(message, { meta });
  }

  error(message: string, meta?: any) {
    console.error(
      chalk.red(`[ERROR]`) + chalk.white(` ${message}`),
      meta ? chalk.gray(JSON.stringify(meta, null, 2)) : ""
    );

    this.logger.error(message, { meta });
  }

  warn(message: string, meta?: any) {
    console.warn(
      chalk.yellow(`[WARN]`) + chalk.white(` ${message}`),
      meta ? chalk.gray(JSON.stringify(meta, null, 2)) : ""
    );

    this.logger.warn(message, { meta });
  }

  debug(message: string, meta?: any) {
    console.debug(
      chalk.green(`[DEBUG]`) + chalk.white(` ${message}`),
      meta ? chalk.gray(JSON.stringify(meta, null, 2)) : ""
    );

    this.logger.debug(message, { meta });
  }
}
