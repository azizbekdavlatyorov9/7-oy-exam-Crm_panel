// dto/verify-otp.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class VerifyOtpDto {
  @ApiProperty({ example: 'davlatyorovazizbek9@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456', description: '6 xonali OTP kod' })
  @IsString()
  code!: string;
}