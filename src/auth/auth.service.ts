import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RegisterInput } from './dto/register.dto';
import { LoginInput } from './dto/login.dto';
import { UpdateUserSnsInput } from './dto/updateUserSns.dto';
import { User } from './entities/user.entity';
import { UserSns } from './entities/user-sns.entity';
import { UpdatePasswordInput } from './dto/updatePassword.dto';
import { UserSkill } from './entities/user-skill.entity';
import { UpdateProfileInput } from './dto/updateProfile';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(UserSns)
    private readonly userSnsRepository: Repository<UserSns>,
    @InjectRepository(UserSkill)
    private readonly userSkillRepository: Repository<UserSkill>,
  ) {}

  findEmail(email: string) {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async register(registerInput: RegisterInput) {
    const user = await this.findEmail(registerInput.email);
    if (user) {
      throw new UnauthorizedException(
        `User #${registerInput.email} is existing`,
      );
    }
    let sns = this.userSnsRepository.create({
      facebook: null,
      instagram: null,
      kakao: null,
      line: null,
      twitter: null,
    });
    sns = await this.userSnsRepository.save(sns);
    const newUser = this.userRepository.create({
      ...registerInput,
      sns,
    });
    return this.userRepository.save(newUser);
  }

  async unregister(user: User) {
    const foundUser = await this.findEmail(user.email);
    if (!foundUser) {
      throw new UnauthorizedException(`User #${foundUser.email} not found\``);
    }
    return this.userRepository.delete(user.id);
  }

  async login({ email, password }: LoginInput) {
    const user = await this.findEmail(email);
    if (!user) {
      throw new UnauthorizedException(`User #${email} not found`);
    }
    const isMatch = await user.validatePassword(password);
    if (!isMatch) {
      throw new UnauthorizedException('is not match password');
    }
    return user;
  }

  async updatePassword(user: User, updatePasswordInput: UpdatePasswordInput) {
    const foundUser = await this.userRepository.findOne(user.id);
    foundUser.password = updatePasswordInput.password;
    return foundUser.save();
  }

  async updateProfile(user: User, updateProfileInput: UpdateProfileInput) {
    const skills =
      updateProfileInput.skills &&
      (await Promise.all(
        updateProfileInput.skills.map((name) => this.preloadSkillByName(name)),
      ));
    const updatedUser = await this.userRepository.preload({
      id: +user.id,
      ...updateProfileInput,
      skills,
    });
    if (!updatedUser) {
      throw new NotFoundException(`User #${user.id} not found`);
    }
    return this.userRepository.save(updatedUser);
  }

  updateUserSns(user: User, updateUserSnsInput: UpdateUserSnsInput) {
    return this.userSnsRepository.update(user.snsId, updateUserSnsInput);
  }

  async getProfile(id: number) {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
      relations: ['sns', 'skills'],
    });
    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  private async preloadSkillByName(name: string): Promise<UserSkill> {
    const existingSkill = await this.userSkillRepository.findOne({ name });
    if (existingSkill) {
      return existingSkill;
    }
    return this.userSkillRepository.create({ name });
  }
}
