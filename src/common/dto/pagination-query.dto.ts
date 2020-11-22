import { Type } from 'class-transformer';
import { IsOptional, IsPositive } from 'class-validator';

export class PaginationQueryDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsPositive()
  @Type(() => Number)
  offset: number;
}

// @Type을 안써도되기위해서는 main.ts의 GlobalPipe의 속성으로
// transformOptions: {
//   enableImplicitConversion: true,
// },
