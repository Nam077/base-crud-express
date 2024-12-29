import {
  JsonController,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  QueryParams,
} from "routing-controllers";
import { Service } from "typedi";
import { ProductService } from "@service/product.service";
import { CreateProductDto } from "@/dto/product/create-product.dto";
import { ProductResponseDto } from "@/dto/product/product-response.dto";
import { UpdateProductDto } from "@/dto/product/update-product.dto";
import { IPaginationOptions, IPaginationResponse } from "@interface/crud.interface";

@Service()
@JsonController("/v1/products")
export class ProductsController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async create(@Body() data: CreateProductDto): Promise<ProductResponseDto> {
    return this.productService.create(data);
  }

  @Post("/bulk")
  async createMany(@Body() data: CreateProductDto[]): Promise<ProductResponseDto[]> {
    return this.productService.createMany(data);
  }

  @Get()
  async findAll(
    @QueryParams() options: IPaginationOptions
  ): Promise<ProductResponseDto[] | IPaginationResponse<ProductResponseDto>> {
    if (options.page && options.limit) {
      return this.productService.paginate(options);
    }
    return this.productService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: number): Promise<ProductResponseDto | null> {
    return this.productService.findById(id);
  }

  @Put("/:id")
  async update(
    @Param("id") id: number,
    @Body() data: UpdateProductDto
  ): Promise<ProductResponseDto> {
    return this.productService.update(id, data);
  }

  @Put("/bulk")
  async updateMany(
    @Body() data: { ids: number[]; data: UpdateProductDto }
  ): Promise<ProductResponseDto[]> {
    return this.productService.updateMany(data.ids, data.data);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number): Promise<boolean> {
    return this.productService.delete(id);
  }

  @Delete("/bulk")
  async deleteMany(@Body() ids: number[]): Promise<boolean> {
    return this.productService.deleteMany(ids);
  }
}
