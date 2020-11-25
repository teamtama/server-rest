import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { User } from '../../auth/entities/user.entity';
import { CommunityComment } from './community-comment.entity';
import { CommunityLike } from './community-like.entity';
import { CommunityTag } from './community-tag-entity';

export enum CommunityCategory {
  NOTICE = 'NOTICE',
  FREE = 'FREE',
  FQ = 'FQ',
  MARKET = 'FREE',
  JOB = 'JOB',
}

@Entity()
export class Community extends BaseEntity {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsEnum(CommunityCategory)
  @IsOptional()
  @Column({ default: CommunityCategory.FREE })
  category: CommunityCategory;

  @ApiProperty()
  @IsString()
  @Column()
  title: string;

  @ApiProperty()
  @IsString()
  @Column()
  description: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  thumbnail: string;

  @ApiProperty()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  userId: number;
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.communities)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ApiProperty({ example: [] })
  @OneToMany(
    () => CommunityComment,
    (communityComment) => communityComment.community,
    {
      cascade: true,
    },
  )
  communityComments: CommunityComment[];

  @ApiProperty({ example: [] })
  @OneToMany(() => CommunityLike, (communityLike) => communityLike.community, {
    cascade: true,
  })
  communityLikes: CommunityLike[];

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  @JoinTable()
  @ManyToMany((type) => CommunityTag, (tag) => tag.communities, {
    cascade: true,
  })
  communityTags: CommunityTag[];
}
