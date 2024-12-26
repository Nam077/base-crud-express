import {
  DeepPartial,
  FindOneOptions,
  FindManyOptions,
  FindOptionsWhere,
} from "typeorm";

export interface ICrudService<
  T, // Entity Type
  CreateDTO = DeepPartial<T>,
  UpdateDTO = DeepPartial<T>,
  ResponseDTO = T,
> {
  // Create
  create(data: CreateDTO): Promise<ResponseDTO>;
  createMany(data: CreateDTO[]): Promise<ResponseDTO[]>;

  // Read
  findAll(options?: FindManyOptions<T>): Promise<ResponseDTO[]>;
  findOne(
    id: number | string,
    options?: FindOneOptions<T>
  ): Promise<ResponseDTO | null>;
  findById(
    id: number | string,
    options?: FindOneOptions<T>
  ): Promise<ResponseDTO | null>;
  findByIds(
    ids: (number | string)[],
    options?: FindManyOptions<T>
  ): Promise<ResponseDTO[]>;
  findOneBy(where: FindOptionsWhere<T>): Promise<ResponseDTO | null>;
  count(options?: FindManyOptions<T>): Promise<number>;

  // Update
  update(id: number | string, data: UpdateDTO): Promise<ResponseDTO>;
  updateMany(ids: (number | string)[], data: UpdateDTO): Promise<ResponseDTO[]>;
  updateBy(where: FindOptionsWhere<T>, data: UpdateDTO): Promise<ResponseDTO[]>;

  // Delete
  delete(id: number | string): Promise<boolean>;
  deleteMany(ids: (number | string)[]): Promise<boolean>;
  deleteBy(where: FindOptionsWhere<T>): Promise<boolean>;

  // Pagination
  paginate(
    options: IPaginationOptions & FindManyOptions<T>
  ): Promise<IPaginationResponse<ResponseDTO>>;

  // Additional Utilities
  exists(where: FindOptionsWhere<T>): Promise<boolean>;
  toDTO(entity: T): ResponseDTO;
  fromDTO(dto: CreateDTO | UpdateDTO): Partial<T>;
}

export interface IPaginationOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, "ASC" | "DESC">;
}

export interface IPaginationResponse<T> {
  items: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface ICrudController<
  T,
  CreateDTO,
  UpdateDTO = Partial<CreateDTO>,
  ResponseDTO = T,
> {
  create(data: CreateDTO): Promise<ResponseDTO>;
  createMany(data: CreateDTO[]): Promise<ResponseDTO[]>;

  findAll(options?: FindManyOptions<T>): Promise<ResponseDTO[]>;
  findOne(id: number | string): Promise<ResponseDTO>;
  findWithPagination(
    options: IPaginationOptions & FindManyOptions<T>
  ): Promise<IPaginationResponse<ResponseDTO>>;

  update(id: number | string, data: UpdateDTO): Promise<ResponseDTO>;
  updateMany(ids: (number | string)[], data: UpdateDTO): Promise<ResponseDTO[]>;

  delete(id: number | string): Promise<void>;
  deleteMany(ids: (number | string)[]): Promise<void>;
}
