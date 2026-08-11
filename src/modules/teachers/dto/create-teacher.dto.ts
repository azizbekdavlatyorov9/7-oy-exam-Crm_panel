import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateTeacherDto {
  @ApiProperty({
    example: "Ali Valiyev",
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  full_name!: string;

  @ApiProperty({
    example: "+998901234567",
  })
  @IsString()
  @IsNotEmpty()
  @Length(9, 20)
  phone_number!: string;

  @ApiProperty({
    example: "Backend Developer",
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 100)
  profession!: string;

  @ApiPropertyOptional({
    example: "ali@gmail.com",
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    example: "teacher.jpg",
  })
  @IsOptional()
  @IsString()
  picture?: string;
}