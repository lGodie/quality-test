import { Controller, Request, Post, UseGuards, Query } from '@nestjs/common';
import { LocalAuthGuard } from './local-auth.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Query('userName') userName: string) {
    console.log(userName);
    return this.authService.login(userName);
  }

  @UseGuards(JwtAuthGuard)
  @Post('validate-token')
  async validateToken(@Request() req) {
    return true;
  }
}
