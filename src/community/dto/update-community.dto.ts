import { PartialType } from '@nestjs/swagger';
import { CreateCommunityInput } from './create-community.dto';

export class UpdateCommunityInput extends PartialType(CreateCommunityInput) {}
