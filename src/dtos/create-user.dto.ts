import {
  IsEmail,
  MinLength,
  IsString,
  IsBoolean,
  IsOptional,
} from "class-validator";
import { Expose } from "class-transformer";

export class CreateUserDto {
  @Expose()
  @IsEmail()
  email!: string;

  @Expose()
  @MinLength(6)
  password!: string;

  @Expose()
  @IsString()
  firstName!: string;

  @Expose()
  @IsString()
  lastName!: string;

  @Expose()
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
