// modules/telegram/telegram.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Auth } from '../auth/entities/auth.entity';
import { Students } from '../students/entities/student.entity';
import { TelegramService } from './telegram.service';

@Module({
  imports: [TypeOrmModule.forFeature([Auth, Students])],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}