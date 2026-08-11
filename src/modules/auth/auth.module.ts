import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";
import {
  ConfigModule,
  ConfigService,
} from "@nestjs/config";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { Auth } from "./entities/auth.entity";

import { TelegramModule } from "../telegram/telegram.module";
import { AuthGuard } from "src/common/guards/auth.guard";

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Auth,
    ]),

    JwtModule.registerAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (
        configService: ConfigService,
      ) => ({
        secret:
          configService.get<string>(
            "JWT_SECRET_KEY",
          ),

        signOptions: {
          expiresIn: "7d",
        },
      }),
    }),

    TelegramModule,
  ],

  controllers: [
    AuthController,
  ],

  providers: [
    AuthService,
    AuthGuard,
  ],

  exports: [
    AuthService,
    JwtModule,
    AuthGuard,
  ],
})
export class AuthModule {}