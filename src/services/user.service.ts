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
import {
  BadRequestException,
  NotFoundException,
  ConflictException
} from "@/exceptions/http.exception";

@Service()
export class UserService
  implements ICrudService<User, CreateUserDto, UpdateUserDto, UserResponseDto> {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) { }

  async create(data: CreateUserDto): Promise<UserResponseDto> {
    try {
      const existingUser = await this.findOneBy({ email: data.email });
      if (existingUser) {
        throw new ConflictException("User with this email already exists");
      }

      const entity = this.repository.create(data);
      const saved = await this.repository.save(entity);
      return this.toDTO(saved);
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: CreateUserDto[]): Promise<UserResponseDto[]> {
    try {
      const entities = this.repository.create(data);
      const saved = await this.repository.save(entities);
      return saved.map((entity) => this.toDTO(entity));
    } catch (error) {
      throw error;
    }
  }

  async findAll(options?: FindManyOptions<User>): Promise<UserResponseDto[]> {
    try {
      const items = await this.repository.find(options);
      return items.map((item) => this.toDTO(item));
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: number | string,
    options?: FindOneOptions<User>
  ): Promise<UserResponseDto> {
    try {
      if (!id) {
        throw new BadRequestException("User ID is required");
      }

      const item = await this.repository.findOne({
        ...options,
        where: { id: Number(id) },
      });

      if (!item) {
        throw new NotFoundException("User not found");
      }

      return this.toDTO(item);
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: number | string,
    options?: FindOneOptions<User>
  ): Promise<UserResponseDto | null> {
    try {
      return this.findOne(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findByIds(
    ids: (number | string)[],
    options?: FindManyOptions<User>
  ): Promise<UserResponseDto[]> {
    try {
      const items = await this.repository.find({
        ...options,
        where: {
          id: In(ids.map((id) => Number(id))),
        },
      });
      return items.map((item) => this.toDTO(item));
    } catch (error) {
      throw error;
    }
  }

  async findOneBy(
    where: FindOptionsWhere<User>
  ): Promise<UserResponseDto | null> {
    try {
      const item = await this.repository.findOne({ where });
      return item ? this.toDTO(item) : null;
    } catch (error) {
      throw error;
    }
  }

  async count(options?: FindManyOptions<User>): Promise<number> {
    try {
      return this.repository.count(options);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number | string,
    data: UpdateUserDto
  ): Promise<UserResponseDto> {
    try {
      if (!id) {
        throw new BadRequestException("User ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("User not found");
      }

      // If email is being updated, check for conflicts
      if (data.email && data.email !== existing.email) {
        const emailExists = await this.findOneBy({ email: data.email });
        if (emailExists) {
          throw new ConflictException("Email already in use");
        }
      }

      await this.repository.update(Number(id), data);
      const updated = await this.findOne(id);
      if (!updated) {
        throw new NotFoundException(`User with id ${id} not found after update`);
      }
      return updated;
    } catch (error) {
      throw error;
    }
  }

  async updateMany(
    ids: (number | string)[],
    data: UpdateUserDto
  ): Promise<UserResponseDto[]> {
    try {
      await this.repository.update(
        ids.map((id) => Number(id)),
        data
      );
      return this.findByIds(ids);
    } catch (error) {
      throw error;
    }
  }

  async updateBy(
    where: FindOptionsWhere<User>,
    data: UpdateUserDto
  ): Promise<UserResponseDto[]> {
    try {
      await this.repository.update(where, data);
      return this.findAll({ where });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number | string): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException("User ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("User not found");
      }

      const result = await this.repository.delete(Number(id));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(ids: (number | string)[]): Promise<boolean> {
    try {
      const result = await this.repository.delete(ids.map((id) => Number(id)));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async deleteBy(where: FindOptionsWhere<User>): Promise<boolean> {
    try {
      const result = await this.repository.delete(where);
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async paginate(
    options: IPaginationOptions & FindManyOptions<User>
  ): Promise<IPaginationResponse<UserResponseDto>> {
    try {
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
    } catch (error) {
      throw error;
    }
  }

  async exists(where: FindOptionsWhere<User>): Promise<boolean> {
    try {
      const count = await this.count({ where });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: number | string): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException("User ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("User not found");
      }

      const result = await this.repository.softDelete(Number(id));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async restore(id: number | string): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException("User ID is required");
      }

      const result = await this.repository.restore(Number(id));
      if (!result.affected) {
        throw new NotFoundException("User not found or already restored");
      }
      return true;
    } catch (error) {
      throw error;
    }
  }

  toDTO(entity: User): UserResponseDto {
    try {
      return {
        id: entity.id,
        email: entity.email,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
      };
    } catch (error) {
      throw error;
    }
  }

  fromDTO(dto: CreateUserDto | UpdateUserDto): Partial<User> {
    try {
      return {
        ...dto,
      };
    } catch (error) {
      throw error;
    }
  }
}
