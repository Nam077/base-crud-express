import { Service } from "typedi";
import {
  Repository,
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  In,
} from "typeorm";
import { Product } from "@entity/product.entity";
import {
  ICrudService,
  IPaginationOptions,
  IPaginationResponse,
} from "@interface/crud.interface";
import { InjectRepository } from "@decorator/inject-repository.decorator";
import { CreateProductDto } from "@/dto/product/create-product.dto";
import { ProductResponseDto } from "@/dto/product/product-response.dto";
import { UpdateProductDto } from "@/dto/product/update-product.dto";
import {
  BadRequestException,
  NotFoundException,
} from "@/exceptions/http.exception";

@Service()
export class ProductService
  implements ICrudService<Product, CreateProductDto, UpdateProductDto, ProductResponseDto> {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>
  ) { }

  async create(data: CreateProductDto): Promise<ProductResponseDto> {
    try {
      const entity = this.repository.create(data);
      const saved = await this.repository.save(entity);
      return this.toDTO(saved);
    } catch (error) {
      throw error;
    }
  }

  async createMany(data: CreateProductDto[]): Promise<ProductResponseDto[]> {
    try {
      const entities = this.repository.create(data);
      const saved = await this.repository.save(entities);
      return saved.map((entity) => this.toDTO(entity));
    } catch (error) {
      throw error;
    }
  }

  async findAll(options?: FindManyOptions<Product>): Promise<ProductResponseDto[]> {
    try {
      const items = await this.repository.find(options);
      return items.map((item) => this.toDTO(item));
    } catch (error) {
      throw error;
    }
  }

  async findOne(
    id: number | string,
    options?: FindOneOptions<Product>
  ): Promise<ProductResponseDto> {
    try {
      if (!id) {
        throw new BadRequestException("Product ID is required");
      }

      const item = await this.repository.findOne({
        ...options,
        where: { id: Number(id) },
      });

      if (!item) {
        throw new NotFoundException("Product not found");
      }

      return this.toDTO(item);
    } catch (error) {
      throw error;
    }
  }

  async findById(
    id: number | string,
    options?: FindOneOptions<Product>
  ): Promise<ProductResponseDto> {
    try {
      return this.findOne(id, options);
    } catch (error) {
      throw error;
    }
  }

  async findByIds(
    ids: (number | string)[],
    options?: FindManyOptions<Product>
  ): Promise<ProductResponseDto[]> {
    try {
      if (!ids?.length) {
        throw new BadRequestException("Product IDs are required");
      }

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
    where: FindOptionsWhere<Product>
  ): Promise<ProductResponseDto> {
    try {
      if (!where) {
        throw new BadRequestException("Search criteria is required");
      }

      const item = await this.repository.findOne({ where });
      
      if (!item) {
        throw new NotFoundException("Product not found");
      }

      return this.toDTO(item);
    } catch (error) {
      throw error;
    }
  }

  async count(options?: FindManyOptions<Product>): Promise<number> {
    try {
      return this.repository.count(options);
    } catch (error) {
      throw error;
    }
  }

  async update(
    id: number | string,
    data: UpdateProductDto
  ): Promise<ProductResponseDto> {
    try {
      if (!id) {
        throw new BadRequestException("Product ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("Product not found");
      }

      await this.repository.update(Number(id), data);
      return this.findOne(id);
    } catch (error) {
      throw error;
    }
  }

  async updateMany(
    ids: (number | string)[],
    data: UpdateProductDto
  ): Promise<ProductResponseDto[]> {
    try {
      if (!ids?.length) {
        throw new BadRequestException("Product IDs are required");
      }

      const existing = await this.findByIds(ids);
      if (existing.length !== ids.length) {
        const foundIds = existing.map(p => p.id);
        const missingIds = ids.filter(id => !foundIds.includes(Number(id)));
        throw new NotFoundException(`Products with ids ${missingIds.join(', ')} not found`);
      }

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
    where: FindOptionsWhere<Product>,
    data: UpdateProductDto
  ): Promise<ProductResponseDto[]> {
    try {
      if (!where) {
        throw new BadRequestException("Search criteria is required");
      }

      await this.repository.update(where, data);
      return this.findAll({ where });
    } catch (error) {
      throw error;
    }
  }

  async delete(id: number | string): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException("Product ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("Product not found");
      }

      const result = await this.repository.delete(Number(id));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async deleteMany(ids: (number | string)[]): Promise<boolean> {
    try {
      if (!ids?.length) {
        throw new BadRequestException("Product IDs are required");
      }

      const existing = await this.findByIds(ids);
      if (existing.length !== ids.length) {
        const foundIds = existing.map(p => p.id);
        const missingIds = ids.filter(id => !foundIds.includes(Number(id)));
        throw new NotFoundException(`Products with ids ${missingIds.join(', ')} not found`);
      }

      const result = await this.repository.delete(ids.map((id) => Number(id)));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async deleteBy(where: FindOptionsWhere<Product>): Promise<boolean> {
    try {
      if (!where) {
        throw new BadRequestException("Search criteria is required");
      }

      const result = await this.repository.delete(where);
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }

  async paginate(
    options: IPaginationOptions & FindManyOptions<Product>
  ): Promise<IPaginationResponse<ProductResponseDto>> {
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

  async exists(where: FindOptionsWhere<Product>): Promise<boolean> {
    try {
      if (!where) {
        throw new BadRequestException("Search criteria is required");
      }

      const count = await this.count({ where });
      return count > 0;
    } catch (error) {
      throw error;
    }
  }

  toDTO(entity: Product): ProductResponseDto {
    try {
      return {
        id: entity.id,
        name: entity.name,
        description: entity.description,
        price: entity.price,
        stock: entity.stock,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    } catch (error) {
      throw error;
    }
  }

  fromDTO(dto: CreateProductDto | UpdateProductDto): Partial<Product> {
    try {
      return {
        ...dto,
      };
    } catch (error) {
      throw error;
    }
  }

  async softDelete(id: number | string): Promise<boolean> {
    try {
      if (!id) {
        throw new BadRequestException("Product ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("Product not found");
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
        throw new BadRequestException("Product ID is required");
      }

      const existing = await this.repository.findOne({
        where: { id: Number(id) }
      });

      if (!existing) {
        throw new NotFoundException("Product not found");
      }

      const result = await this.repository.restore(Number(id));
      return !!result.affected;
    } catch (error) {
      throw error;
    }
  }
}
