import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { Auth } from './entities/auth.entity';
import { RegisterAuthDto } from './dto/register-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { TelegramService } from '../telegram/telegram.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,
    private readonly jwtService: JwtService,
    private readonly telegramService: TelegramService,
  ) {}

  async register(dto: RegisterAuthDto) {
    const existing = await this.authRepo.findOne({
      where: { email: dto.email },
    });
    if (existing) {
      throw new BadRequestException('Bu email allaqachon ro\'yxatdan o\'tgan');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = this.authRepo.create({
      username: dto.username,
      email: dto.email,
      password: hashedPassword,
    });

    await this.authRepo.save(user);

    return {
      message: 'Ro\'yxatdan muvaffaqiyatli o\'tdingiz',
      userId: user.id,
    };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.authRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email yoki parol noto\'g\'ri');
    }

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      accessToken: token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }

  async sendOtp(email: string) {
    const user = await this.authRepo.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    user.code = code;
    user.otpTime = Date.now() + 5 * 60 * 1000;
    await this.authRepo.save(user);

    if (user.telegramChatId) {
      await this.telegramService.sendOtp(user.telegramChatId, code);
      return { message: 'OTP Telegram orqali yuborildi' };
    }

    return { message: 'OTP yuborildi (Telegram ulanmagan)', code };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const user = await this.authRepo.findOne({ where: { email: dto.email } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    if (!user.code || !user.otpTime) {
      throw new BadRequestException('OTP so\'ralmagan');
    }

    if (Date.now() > Number(user.otpTime)) {
      throw new BadRequestException('OTP muddati tugagan');
    }

    if (user.code !== dto.code) {
      throw new BadRequestException('OTP noto\'g\'ri');
    }

    user.code = null as any;
    user.otpTime = null as any;
    await this.authRepo.save(user);

    return { message: 'OTP tasdiqlandi' };
  }

  async generateTelegramLink(userId: number) {
    const user = await this.authRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Foydalanuvchi topilmadi');
    }

    const code = Math.random().toString(36).substring(2, 10);
    user.telegramLinkCode = code;
    await this.authRepo.save(user);

    const botUsername = process.env.BOT_USERNAME;
    return { link: `https://t.me/${botUsername}?start=${code}` };
  }
}