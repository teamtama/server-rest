import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UpdatePasswordInput extends PickType(User, [
  'password',
] as const) {}
