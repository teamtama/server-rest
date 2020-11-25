import { Module } from '@nestjs/common';
import { CommunityController } from './community.controller';
import { CommunityService } from './community.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { User } from '../auth/entities/user.entity';
import { CommunityComment } from './entities/community-comment.entity';
import { CommunityLike } from './entities/community-like.entity';
import { CommunityTag } from './entities/community-tag-entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Community,
      CommunityComment,
      CommunityLike,
      CommunityTag,
      User,
    ]),
  ],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
