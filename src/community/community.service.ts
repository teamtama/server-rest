import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Community } from './entities/community.entity';
import { Repository } from 'typeorm';
import { CommunityComment } from './entities/community-comment.entity';
import { CommunityLike } from './entities/community-like.entity';
import { CommunityTag } from './entities/community-tag-entity';
import { CreateCommunityInput } from './dto/create-community.dto';
import { User } from '../auth/entities/user.entity';
import { UpdateCommunityInput } from './dto/update-community.dto';
import { CreateCommunityCommentInput } from './dto/create-community-comment.dto';
import { UpdateCommunityCommentInput } from './dto/update-community-comment.dto';

@Injectable()
export class CommunityService {
  constructor(
    @InjectRepository(Community)
    private readonly communityRepository: Repository<Community>,
    @InjectRepository(CommunityComment)
    private readonly commentRepository: Repository<CommunityComment>,
    @InjectRepository(CommunityLike)
    private readonly likeRepository: Repository<CommunityLike>,
    @InjectRepository(CommunityTag)
    private readonly tagRepository: Repository<CommunityTag>,
  ) {}

  /**
   * @param user
   * @param createCommunityInput
   */

  async createCommunity(
    user: User,
    createCommunityInput: CreateCommunityInput,
  ) {
    const communityTags =
      createCommunityInput.communityTags &&
      (await Promise.all(
        createCommunityInput.communityTags.map((name) =>
          this.preloadTagByName(name),
        ),
      ));

    const community = this.communityRepository.create({
      ...createCommunityInput,
      communityTags,
      user,
    });

    return this.communityRepository.save(community);
  }

  /**
   *
   * @param communityId
   * @param user
   * @param updateCommunityInput
   */

  async updateCommunity(
    communityId: number,
    user: User,
    updateCommunityInput: UpdateCommunityInput,
  ) {
    const communityTags =
      updateCommunityInput.communityTags &&
      (await Promise.all(
        updateCommunityInput.communityTags.map((name) =>
          this.preloadTagByName(name),
        ),
      ));

    const community = await this.communityRepository.preload({
      id: communityId,
      ...updateCommunityInput,
      communityTags,
    });

    if (!community) {
      throw new NotFoundException(`Community #${communityId} not found`);
    }

    if (community.userId !== user.id) {
      throw new UnauthorizedException(`Permission error`);
    }

    return this.communityRepository.save(community);
  }

  /**
   *
   * @param communityId
   * @param user
   */

  async deleteCommunity(communityId: number, user: User) {
    const community = await this.communityRepository.findOne(communityId);
    if (!community) {
      throw new NotFoundException(`Community #${communityId} not found`);
    }
    if (community.userId !== user.id) {
      throw new UnauthorizedException(`Permission error`);
    }
    return this.communityRepository.delete(communityId);
  }

  /**
   *
   */

  getCommunityList() {
    const query = this.communityRepository
      .createQueryBuilder('community')
      .leftJoinAndSelect('community.user', 'user')
      .leftJoinAndSelect('community.communityComments', 'comments')
      .leftJoinAndSelect('community.communityLikes', 'likes')
      .leftJoinAndSelect('community.communityTags', 'tags')
      .getMany();
    return query;
  }

  /**
   *
   * @param id
   */

  async getCommunity(id: number) {
    const community = await this.communityRepository
      .createQueryBuilder('community')
      .where('community.id = :id', { id })
      .leftJoinAndSelect('community.user', 'user')
      .leftJoinAndSelect('community.communityComments', 'comments')
      .leftJoinAndSelect('community.communityLikes', 'likes')
      .leftJoinAndSelect('community.communityTags', 'tags')
      .getOne();
    if (!community) {
      throw new NotFoundException(`Community #${id} not found`);
    }
    return community;
  }

  /**
   *
   * @param name
   * @private
   */

  private async preloadTagByName(name: string): Promise<CommunityTag> {
    const existingTag = await this.tagRepository.findOne({ name });
    if (existingTag) {
      return existingTag;
    }
    return this.tagRepository.create({ name });
  }

  /**
   * Comment
   */

  /**
   *
   * @param communityId
   * @param user
   * @param createCommunityCommentInput
   */

  createComment(
    communityId: number,
    user: User,
    createCommunityCommentInput: CreateCommunityCommentInput,
  ) {
    const comment = this.commentRepository.create({
      communityId,
      user,
      ...createCommunityCommentInput,
    });
    return this.commentRepository.save(comment);
  }

  /**
   *
   * @param commentId
   * @param user
   * @param updateCommunityCommentInput
   */

  async updateComment(
    commentId: number,
    user: User,
    updateCommunityCommentInput: UpdateCommunityCommentInput,
  ) {
    const comment = await this.commentRepository.preload({
      id: commentId,
      ...updateCommunityCommentInput,
    });

    if (!comment) {
      throw new NotFoundException(`Community comment #${commentId} not found`);
    }

    if (comment.userId !== user.id) {
      throw new UnauthorizedException(`Permission error`);
    }

    return this.commentRepository.save(comment);
  }

  /**
   *
   * @param commentId
   * @param user
   */

  async deleteComment(commentId: number, user: User) {
    const comment = await this.commentRepository.findOne({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new NotFoundException(`Community comment #${commentId} not found`);
    }
    if (comment.userId !== user.id) {
      throw new UnauthorizedException(`Permission error`);
    }
    return this.commentRepository.delete(commentId);
  }

  /**
   *
   * @param communityId
   * @param user
   */

  async like(communityId: number, user: User) {
    const community = await this.communityRepository.findOne({
      where: {
        id: communityId,
      },
      relations: ['communityLikes'],
    });
    if (community.communityLikes.find((like) => like.userId === user.id)) {
      throw new InternalServerErrorException('already exists in the like');
    }
    const like = this.likeRepository.create({
      user,
      communityId,
    });
    return this.likeRepository.save(like);
  }

  /**
   *
   * @param communityId
   * @param user
   */

  async unlike(communityId: number, user: User) {
    const community = await this.communityRepository.findOne({
      where: {
        id: communityId,
      },
      relations: ['communityLikes'],
    });
    const foundLike = community.communityLikes.find(
      (like) => like.userId === user.id,
    );
    if (!foundLike) {
      throw new InternalServerErrorException("dosen't exists in the like");
    }
    return this.likeRepository.delete(foundLike.id);
  }
}
