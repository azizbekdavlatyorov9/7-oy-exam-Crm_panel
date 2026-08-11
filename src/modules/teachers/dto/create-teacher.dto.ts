import { ApiProperty } from "@nestjs/swagger";
import {
  IsEmail,
  IsString,
  Length,
} from "class-validator";

export class CreateTeacherDto {
  @ApiProperty({
    example: "Ali Valiyev",
  })
  @IsString()
  full_name!: string;

  @ApiProperty({
    example: "+998901234567",
  })
  @IsString()
  phone_number!: string;

  @ApiProperty({
    example: "Backend Developer",
  })
  @IsString()
  profession!: string;

  @ApiProperty({
    example: "ali@gmail.com",
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    type: "string",
    format: "binary",
    required: false,
  })
  picture?: any;
}