import { Controller, Post, Body, Get, UseGuards, Req, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('protected')
  getProtected(@Req() req) {
    return {
      message: 'Access granted',
      user: req.user,
    };
  }

  @Post('register')
register(@Body() body: { email: string; password: string; name: string }) {
  const { email, password, name } = body;
  return this.authService.register(email, password, name);
}

  @Get('login')
  loginInfo() {
    return {
      message: 'Endpoint login menggunakan method POST ya'
    };
  }

  @Post('login')
  login(@Body() body: { email: string; password: string }) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Req() req) {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res) {
    const result = await this.authService.validateGoogleUser(req.user);
    
    // Construct redirect URL with query params
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const redirectUrl = `${frontendUrl}/auth/callback?token=${result.access_token}&role=${result.role}&name=${encodeURIComponent(result.name || '')}`;
    
    return res.redirect(redirectUrl);
  }
}