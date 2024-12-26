import { Service } from "typedi";
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  In,
} from "typeorm";
import { User } from "@entity/user.entity";
import {
  ICrudService,
  IPaginationOptions,
  IPaginationResponse,
} from "@interface/crud.interface";
import { CreateUserDto } from "@dto/create-user.dto";
import { UpdateUserDto } from "@dto/user/update-user.dto";
import { UserResponseDto } from "@dto/user/user-response.dto";
import { InjectRepository } from "@decorator/inject-repository.decorator";

@Service()
export class UserService
  implements ICrudService<User, CreateUserDto, UpdateUserDto, UserResponseDto>
{
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}
  async create(data: CreateUserDto): Promise<UserResponseDto> {
    const entity = this.repository.create(data);
    const saved = await this.repository.save(entity);
    return this.toDTO(saved);
  }
  async createMany(data: CreateUserDto[]): Promise<UserResponseDto[]> {
    const entities = this.repository.create(data);
    const saved = await this.repository.save(entities);
    return saved.map((entity) => this.toDTO(entity));
  }
  async findAll(options?: FindManyOptions<User>): Promise<UserResponseDto[]> {
    const items = await this.repository.find(options);
    return items.map((item) => this.toDTO(item));
  }
  async findOne(
    id: number | string,
    options?: FindOneOptions<User>
  ): Promise<UserResponseDto | null> {
    const item = await this.repository.findOne({
      ...options,
      where: { id: Number(id) },
    });
    return item ? this.toDTO(item) : null;
  }
  async findById(
    id: number | string,
    options?: FindOneOptions<User>
  ): Promise<UserResponseDto | null> {
    return this.findOne(id, options);
  }
  async findByIds(
    ids: (number | string)[],
    options?: FindManyOptions<User>
  ): Promise<UserResponseDto[]> {
    const items = await this.repository.find({
      ...options,
      where: {
        id: In(ids.map((id) => Number(id))),
      },
    });
    return items.map((item) => this.toDTO(item));
  }
  async findOneBy(
    where: FindOptionsWhere<User>
  ): Promise<UserResponseDto | null> {
    const item = await this.repository.findOne({ where });
    return item ? this.toDTO(item) : null;
  }
  async count(options?: FindManyOptions<User>): Promise<number> {
    return this.repository.count(options);
  }
  async update(
    id: number | string,
    data: UpdateUserDto
  ): Promise<UserResponseDto> {
    await this.repository.update(Number(id), data);
    const updated = await this.findOne(id);
    if (!updated) throw new Error("User not found");
    return updated;
  }
  async updateMany(
    ids: (number | string)[],
    data: UpdateUserDto
  ): Promise<UserResponseDto[]> {
    await this.repository.update(
      ids.map((id) => Number(id)),
      data
    );
    return this.findByIds(ids);
  }
  async updateBy(
    where: FindOptionsWhere<User>,
    data: UpdateUserDto
  ): Promise<UserResponseDto[]> {
    await this.repository.update(where, data);
    return this.findAll({ where });
  }
  async delete(id: number | string): Promise<boolean> {
    const result = await this.repository.delete(Number(id));
    return !!result.affected;
  }
  async deleteMany(ids: (number | string)[]): Promise<boolean> {
    const result = await this.repository.delete(ids.map((id) => Number(id)));
    return !!result.affected;
  }
  async deleteBy(where: FindOptionsWhere<User>): Promise<boolean> {
    const result = await this.repository.delete(where);
    return !!result.affected;
  }
  async paginate(
    options: IPaginationOptions & FindManyOptions<User>
  ): Promise<IPaginationResponse<UserResponseDto>> {
    const [items, total] = await this.repository.findAndCount({
      skip: ((options.page || 1) - 1) * (options.limit || 10),
      take: options.limit || 10,
      order: options.sort || {},
      where: options.where,
      relations: options.relations,
    });

    return {
      items: items.map((item) => this.toDTO(item)),
      meta: {
        total,
        page: options.page || 1,
        limit: options.limit || 10,
        totalPages: Math.ceil(total / (options.limit || 10)),
        hasNextPage: (options.page || 1) * (options.limit || 10) < total,
        hasPreviousPage: (options.page || 1) > 1,
      },
    };
  }
  async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    const count = await this.count({ where });
    return count > 0;
  }
  toDTO(entity: User): UserResponseDto {
    return {
      id: entity.id,
      email: entity.email,
      isActive: entity.isActive,
      createdAt: entity.createdAt,
    };
  }
  fromDTO(dto: CreateUserDto | UpdateUserDto): Partial<User> {
    return {
      ...dto,
    };
  }
  async softDelete(id: number | string): Promise<boolean> {
    const result = await this.repository.softDelete(Number(id));
    return !!result.affected;
  }
  async restore(id: number | string): Promise<boolean> {
    const result = await this.repository.restore(Number(id));
    return !!result.affected;
  }
}
