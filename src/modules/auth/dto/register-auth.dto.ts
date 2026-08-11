// dto/register-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterAuthDto {
  @ApiProperty({ example: 'azizbek', description: 'Foydalanuvchi nomi' })
  @IsString()
  username!: string;

  @ApiProperty({ example: 'davlatyorovazizbek9@gmail.com', description: 'Email manzil' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'azizbek98', minLength: 6, description: 'Parol' })
  @IsString()
  @MinLength(6)
  password!: string;
}