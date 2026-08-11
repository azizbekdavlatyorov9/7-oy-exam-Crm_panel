import { ApiProperty } from '@nestjs/swagger';

export class TelegramLinkResponseDto {
  @ApiProperty()
  link!: string;
}