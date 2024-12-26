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
import { UserService } from "@service/user.service";
import { CreateUserDto } from "@dto/create-user.dto";
import { UpdateUserDto } from "@dto/user/update-user.dto";
import { UserResponseDto } from "@dto/user/user-response.dto";
import { IPaginationOptions } from "@interface/crud.interface";
import {
  NotFoundException,
  UnauthorizedException,
} from "../../exceptions/http.exception";
import { HttpStatus } from "../../constants/http.constant";

@Service()
@JsonController("/v1/users")
export class UsersController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() data: CreateUserDto): Promise<UserResponseDto> {
    console.log("Received create request:", data);
    return this.userService.create(data);
  }

  @Get()
  findAll(): Promise<UserResponseDto[]> {
    return this.userService.findAll();
  }

  @Get("/:id")
  async findOne(@Param("id") id: number): Promise<UserResponseDto> {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }

  @Put("/:id")
  update(
    @Param("id") id: number,
    @Body() data: UpdateUserDto
  ): Promise<UserResponseDto> {
    return this.userService.update(id, data);
  }

  @Delete("/:id")
  async delete(@Param("id") id: number): Promise<void> {
    await this.userService.delete(id);
  }

  @Get("/paginate")
  findWithPagination(
    @QueryParams() options: IPaginationOptions
  ): Promise<{ items: UserResponseDto[]; meta: any }> {
    return this.userService.paginate(options);
  }
}
