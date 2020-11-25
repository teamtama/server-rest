import { PickType } from '@nestjs/swagger';
import { UserSns } from '../entities/user-sns.entity';

export class UpdateUserSnsInput extends PickType(UserSns, [
  'kakao',
  'line',
  'instagram',
  'facebook',
  'twitter',
] as const) {}
