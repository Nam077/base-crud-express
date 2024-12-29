import { Exclude, Expose, Transform } from "class-transformer";
@Exclude()
export class ProductResponseDto {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  @Transform(({ value }) => Number(value))
  price!: number;

  @Expose()
  @Transform(({ value }) => Number(value))
  stock!: number;

  @Expose()
  @Transform(({ value }) => Boolean(value))
  isActive!: boolean;

  @Expose()
  @Transform(({ value }) => new Date(value))
  createdAt!: Date;

  @Expose()
  @Transform(({ value }) => new Date(value))
  updatedAt!: Date;
}
