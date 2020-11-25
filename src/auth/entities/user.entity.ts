import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InternalServerErrorException } from '@nestjs/common';
import { UserSns } from './user-sns.entity';
import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserSkill } from './user-skill.entity';
import { Community } from '../../community/entities/community.entity';
import { CommunityComment } from '../../community/entities/community-comment.entity';
import { CommunityTag } from '../../community/entities/community-tag-entity';

export enum UserRole {
  CLIENT,
  ADMIN,
}

@Entity()
export class User extends BaseEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsString()
  @Column()
  username: string;

  @ApiProperty()
  @IsEmail()
  @Column()
  email: string;

  @ApiProperty()
  @IsString()
  @Column()
  password: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  avatar: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Column({ nullable: true })
  introduce: string;

  @ApiProperty()
  @IsEnum(UserRole)
  @IsOptional()
  @Column({ default: UserRole.CLIENT })
  role: UserRole;

  @ApiProperty()
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty()
  @Column()
  snsId: number;
  @OneToOne(() => UserSns, {
    cascade: true,
  })
  @JoinColumn({ name: 'snsId' })
  sns: UserSns;

  @ApiProperty({ example: [] })
  @IsString({ each: true })
  @JoinTable()
  @ManyToMany((type) => UserSkill, (skill) => skill.users, {
    cascade: true,
  })
  skills: UserSkill[];

  @ApiProperty({ example: [] })
  @OneToMany(() => Community, (community) => community.user, {
    cascade: true,
  })
  communities: Community[];

  @ApiProperty({ example: [] })
  @OneToMany(
    () => CommunityComment,
    (communityComment) => communityComment.user,
    {
      cascade: true,
    },
  )
  communityComments: CommunityComment[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashedPassword() {
    try {
      if (this.password) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
      }
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async validatePassword(aPassword: string) {
    try {
      return await bcrypt.compare(aPassword, this.password);
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }
}
