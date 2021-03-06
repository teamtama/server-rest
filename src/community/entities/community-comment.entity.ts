import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsString } from 'class-validator';
import { User } from '../../auth/entities/user.entity';
import { Community } from './community.entity';

@Entity()
export class CommunityComment extends BaseEntity {
  @ApiProperty()
  @IsNumber()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  body: string;

  @ApiProperty()
  @IsDate()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @UpdateDateColumn()
  updatedAt: Date;

  @Column()
  userId: number;
  @ApiProperty()
  @ManyToOne(() => User, (user) => user.communityComments)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  communityId: number;
  @ApiProperty()
  @ManyToOne(() => Community, (community) => community.communityComments)
  @JoinColumn({ name: 'communityId' })
  community: Community;
}
