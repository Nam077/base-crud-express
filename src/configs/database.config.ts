import { DataSource, DataSourceOptions } from "typeorm";
import { Container } from "typedi";
import { User } from "@entity/user.entity";
import { EnvConfig } from "@config/env.config";

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private readonly dataSource: DataSource;

  private constructor() {
    const env = EnvConfig.getInstance();

    const options: DataSourceOptions = {
      type: "sqlite",
      database: env.env === "production" ? "prod.db" : "dev.db",
      entities: [User],
      synchronize: env.env === "development",
      logging: env.env === "development",
    };

    this.dataSource = new DataSource(options);
    // Register với tên theo entity
    Container.set(
      `${User.name}Repository`,
      this.dataSource.getRepository(User)
    );
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public async initialize(): Promise<void> {
    try {
      await this.dataSource.initialize();
      console.log("Data Source has been initialized!");
    } catch (error) {
      console.error("Error during Data Source initialization:", error);
      throw error;
    }
  }

  get AppDataSource(): DataSource {
    return this.dataSource;
  }
}
