import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class RegisterInput extends PickType(User, [
  'username',
  'email',
  'password',
  'role',
  'introduce',
] as const) {}
