import { PartialType } from '@nestjs/swagger';
import { CommunityComment } from '../entities/community-comment.entity';

export class UpdateCommunityCommentInput extends PartialType(
  CommunityComment,
) {}
