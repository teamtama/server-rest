import { PickType } from '@nestjs/swagger';
import { CommunityComment } from '../entities/community-comment.entity';

export class CreateCommunityCommentInput extends PickType(CommunityComment, [
  'body',
] as const) {}
