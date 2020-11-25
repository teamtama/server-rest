import { Request } from 'express';
import { User } from '../auth/entities/user.entity';

export interface IPassportRequestInterface extends Request {
  user: User;
}
