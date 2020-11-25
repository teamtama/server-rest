import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { SessionSerializer } from './session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserSns } from './entities/user-sns.entity';
import { UserSkill } from './entities/user-skill.entity';

@Module({
  imports: [
    PassportModule.register({
      session: true,
    }),
    TypeOrmModule.forFeature([User, UserSns, UserSkill]),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, SessionSerializer],
})
export class AuthModule {}
