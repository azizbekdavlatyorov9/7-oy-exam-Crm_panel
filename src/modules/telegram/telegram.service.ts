// modules/telegram/telegram.service.ts
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import TelegramBot from 'node-telegram-bot-api';

import { Auth, UserRole } from '../auth/entities/auth.entity';
import { Students } from '../students/entities/student.entity';

@Injectable()
export class TelegramService implements OnModuleInit {
  private readonly logger = new Logger(TelegramService.name);
  private bot!: TelegramBot;

  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    @InjectRepository(Students) private readonly studentsRepo: Repository<Students>,
  ) {}

  onModuleInit() {
    const token = process.env.BOT_TOKEN;
    if (!token) {
      this.logger.error('BOT_TOKEN topilmadi, bot ishga tushmadi');
      return;
    }

    this.bot = new TelegramBot(token, { polling: true });
    this.registerHandlers();
    this.logger.log('Telegram bot ishga tushdi');
  }

  private registerHandlers() {
    this.bot.onText(/\/start(?:\s+(.+))?/, async (msg, match) => {
      const chatId = msg.chat.id;
      const payload = match?.[1];

      if (!payload) {
        await this.bot.sendMessage(
          chatId,
          "Assalomu alaykum! CRM Panel botiga xush kelibsiz.\n\nHisobingizni ulash uchun tizimdagi 'Telegramni ulash' tugmasidan foydalaning.",
        );
        return;
      }

      const user = await this.authRepo.findOne({ where: { telegramLinkCode: payload } });

      if (!user) {
        await this.bot.sendMessage(chatId, "❌ Kod noto'g'ri yoki muddati o'tgan.");
        return;
      }

      user.telegramChatId = chatId.toString();
      user.telegramLinkCode = null as any;
      await this.authRepo.save(user);

      await this.bot.sendMessage(chatId, `✅ Hisobingiz ulandi, ${user.username}!\n\nEndi OTP va bildirishnomalar shu yerga keladi.`);
    });

    this.bot.onText(/\/students/, async (msg) => {
      if (!(await this.checkAdmin(msg.chat.id))) return;

      const students = await this.studentsRepo.find({ order: { id: 'DESC' }, take: 10 });

      if (!students.length) {
        await this.bot.sendMessage(msg.chat.id, "Hozircha o'quvchilar yo'q.");
        return;
      }

      const text = students
        .map((s) => `🆔 ${s.id} — <b>${s.full_name}</b>\n📞 ${s.phone_number}\n💼 ${s.profession}`)
        .join('\n\n');

      await this.bot.sendMessage(msg.chat.id, `📋 Oxirgi 10 ta o'quvchi:\n\n${text}`, { parse_mode: 'HTML' });
    });

    this.bot.onText(/\/find(?:\s+(\d+))?/, async (msg, match) => {
      if (!(await this.checkAdmin(msg.chat.id))) return;

      const id = Number(match?.[1]);
      if (!id) return void this.bot.sendMessage(msg.chat.id, 'Foydalanish: /find <id>');

      const student = await this.studentsRepo.findOne({ where: { id } });
      if (!student) return void this.bot.sendMessage(msg.chat.id, "O'quvchi topilmadi");

      await this.bot.sendMessage(
        msg.chat.id,
        `🆔 ${student.id}\n👤 ${student.full_name}\n📞 ${student.phone_number}\n💼 ${student.profession}\n👨‍👩‍👦 ${student.parent_name} (${student.parent_number})`,
      );
    });

    this.bot.onText(/\/delete(?:\s+(\d+))?/, async (msg, match) => {
      if (!(await this.checkAdmin(msg.chat.id))) return;

      const id = Number(match?.[1]);
      if (!id) return void this.bot.sendMessage(msg.chat.id, 'Foydalanish: /delete <id>');

      const student = await this.studentsRepo.findOne({ where: { id } });
      if (!student) return void this.bot.sendMessage(msg.chat.id, "O'quvchi topilmadi");

      await this.studentsRepo.softDelete(id);
      await this.bot.sendMessage(msg.chat.id, `🗑 ${student.full_name} ro'yxatdan chiqarildi.`);
    });

    this.bot.onText(/\/help/, async (msg) => {
      await this.bot.sendMessage(
        msg.chat.id,
        "📌 Buyruqlar:\n/students — oxirgi o'quvchilar\n/find <id> — topish\n/delete <id> — o'chirish",
      );
    });

    this.bot.on('polling_error', (err) => {
      this.logger.error(`Polling xatosi: ${err.message}`);
    });
  }

  private async checkAdmin(chatId: number): Promise<boolean> {
    const user = await this.authRepo.findOne({ where: { telegramChatId: chatId.toString() } });

    if (!user || user.role !== UserRole.ADMIN && UserRole.USER) {
      await this.bot.sendMessage(chatId, '⛔ Bu buyruq faqat adminlar uchun.');
      return false;
    }
    return true;
  }

  async sendMessage(chatId: string | number, text: string) {
    try {
      await this.bot.sendMessage(chatId, text, { parse_mode: 'HTML' });
    } catch (err: any) {
      this.logger.error(`Telegramga xabar yuborilmadi: ${err.message}`);
    }
  }

  async sendOtp(chatId: string, code: string) {
    await this.sendMessage(chatId, `🔐 Sizning tasdiqlash kodingiz: <b>${code}</b>\n\n5 daqiqa amal qiladi.`);
  }

  async notifyAdmins(text: string) {
    const admins = await this.authRepo.find({ where: { role: UserRole.ADMIN && UserRole.USER } });
    for (const admin of admins) {
      if (admin.telegramChatId) {
        await this.sendMessage(admin.telegramChatId, text);
      }
    }
  }
}