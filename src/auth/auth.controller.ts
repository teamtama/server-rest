import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterInput } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { IPassportRequestInterface } from '../interfaces/IPassportRequest.interface';
import { AuthenticateGuard } from '../common/guards/authenticate.guard';
import { Public } from '../common/decorators/public.decorator';
import { UpdateUserSnsInput } from './dto/updateUserSns.dto';
import { ParseIntPipe } from '../common/pipes/parse-int.pipe';
import { AuthService } from './auth.service';
import { UpdateProfileInput } from './dto/updateProfile';
import { UpdatePasswordInput } from './dto/updatePassword.dto';

@UseGuards(AuthenticateGuard)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @Post('unregister')
  async unregister(@Request() req: IPassportRequestInterface) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      }
    });
    await this.authService.unregister(req.user);
    return req.logout();
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  login(@Request() req: IPassportRequestInterface) {
    return req.user;
  }

  @Get('me')
  me(@Request() req: IPassportRequestInterface) {
    console.log(req);
    return req.user;
  }

  @Get('logout')
  logout(@Request() req: IPassportRequestInterface) {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
      }
      return req.logout();
    });
  }

  @Put('password')
  updatePassword(
    @Request() req,
    @Body() updatePasswordInput: UpdatePasswordInput,
  ) {
    const user = req.user;
    return this.authService.updatePassword(user, updatePasswordInput);
  }

  @Patch('sns')
  updateUserSns(
    @Request() req,
    @Body() updateUserSnsInput: UpdateUserSnsInput,
  ) {
    const user = req.user;
    return this.authService.updateUserSns(user, updateUserSnsInput);
  }

  @Patch('profile')
  updateUser(@Request() req, @Body() updateProfileInput: UpdateProfileInput) {
    const user = req.user;
    return this.authService.updateProfile(user, updateProfileInput);
  }

  @Public()
  @Get('profile/:id')
  getProfile(@Param('id', ParseIntPipe) id: number) {
    return this.authService.getProfile(id);
  }
}
