import { Community } from '../entities/community.entity';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCommunityInput extends PickType(Community, [
  'category',
  'title',
  'description',
  'thumbnail',
] as const) {
  @ApiProperty({ example: [] })
  @IsString({ each: true })
  @IsOptional()
  readonly communityTags: string[];
}
