import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class LoginInput extends PickType(User, [
  'email',
  'password',
] as const) {}
