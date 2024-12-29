import { DataSource, DataSourceOptions, EntityTarget } from "typeorm";
import { Container } from "typedi";
import { User } from "@entity/user.entity";
import { EnvConfig } from "@config/env.config";
import { Product } from "@/entities/product.entity";

export class DatabaseConfig {
  private static instance: DatabaseConfig;
  private readonly dataSource: DataSource;

  private registerRepositories(entities: EntityTarget<any>[]): void {
    entities.forEach(entity => {
      const repository = this.dataSource.getRepository(entity);
      const entityName = (entity as Function).name;
      Container.set(`${entityName}Repository`, repository);
    });
  }

  private constructor() {
    const env = EnvConfig.getInstance();
    const dbConfig = env.dbConfig;

    const commonOptions = {
      entities: [User, Product],
      synchronize: env.env === "development",
      logging: env.env === "development",
    };

    const options: DataSourceOptions = {
      ...dbConfig,
      ...commonOptions,
    };

    this.dataSource = new DataSource(options);
    
    // Register repositories automatically from commonOptions
    this.registerRepositories(commonOptions.entities);
  }

  public static getInstance(): DatabaseConfig {
    if (!DatabaseConfig.instance) {
      DatabaseConfig.instance = new DatabaseConfig();
    }
    return DatabaseConfig.instance;
  }

  public getDataSource(): DataSource {
    return this.dataSource;
  }

  public async initialize(): Promise<void> {
    await this.dataSource.initialize();
  }
}
