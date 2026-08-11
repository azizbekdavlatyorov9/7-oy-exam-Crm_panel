import { Body, Controller, Post, UseGuards, Get, Req } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { LoginResponseDto, MessageResponseDto } from './dto/auth-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { TelegramLinkResponseDto } from '../telegram/dto/telegram-link-response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Ro\'yxatdan o\'tish' })
  @ApiResponse({
    status: 201,
    description: 'Muvaffaqiyatli ro\'yxatdan o\'tildi',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Email allaqachon mavjud' })
  register(@Body() dto: RegisterAuthDto) {
    return this.authService.register(dto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Tizimga kirish' })
  @ApiResponse({
    status: 200,
    description: 'Muvaffaqiyatli login',
    type: LoginResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Email yoki parol noto\'g\'ri' })
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('send-otp')
  @ApiOperation({ summary: 'OTP kod yuborish' })
  @ApiResponse({
    status: 201,
    description: 'OTP yuborildi',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Foydalanuvchi topilmadi' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.email);
  }

  @Post('verify-otp')
  @ApiOperation({ summary: 'OTP kodni tasdiqlash' })
  @ApiResponse({
    status: 201,
    description: 'OTP tasdiqlandi',
    type: MessageResponseDto,
  })
  @ApiResponse({ status: 400, description: 'OTP noto\'g\'ri yoki muddati tugagan' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('me')
  @ApiOperation({ summary: 'Joriy foydalanuvchi ma\'lumotlari' })
  @ApiResponse({ status: 200, description: 'Foydalanuvchi profili' })
  @ApiResponse({ status: 401, description: 'Token yaroqsiz' })
  getProfile(@Req() req: any) {
    return req.user;
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('telegram-link')
  @ApiOperation({ summary: 'Telegramni ulash uchun havola olish' })
  @ApiResponse({ status: 200, type: TelegramLinkResponseDto })
  getTelegramLink(@Req() req: any) {
    return this.authService.generateTelegramLink(req.user.sub);
  }
}