import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty({ default: 'Aziz Karimov' })
  @IsString({ message: "String typeda bo'lishi kerak" })
  @Length(3, 100)
  full_name!: string;

  @ApiProperty({ default: '+998901234567' })
  @IsString()
  @Length(9, 20)
  phone_number!: string;

  @ApiProperty({ default: 'Dasturchi' })
  @IsString()
  @Length(2, 100)
  profession!: string;

  @ApiProperty({ default: 'Karim Karimov' })
  @IsString()
  @Length(3, 100)
  parent_name!: string;

  @ApiProperty({ default: '+998907654321' })
  @IsString()
  @Length(9, 20)
  parent_number!: string;

}