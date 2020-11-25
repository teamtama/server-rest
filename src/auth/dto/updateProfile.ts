import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { RegisterInput } from './register.dto';

export class UpdateProfileInput extends PartialType(RegisterInput) {
  @ApiProperty({ example: [] })
  @IsString({ each: true })
  @IsOptional()
  readonly skills: string[];
}
