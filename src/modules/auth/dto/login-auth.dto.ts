// dto/login-auth.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginAuthDto {
  @ApiProperty({ example: 'davlatyorovazizbek9@gmail.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'azizbek98' })
  @IsString()
  password!: string;
}