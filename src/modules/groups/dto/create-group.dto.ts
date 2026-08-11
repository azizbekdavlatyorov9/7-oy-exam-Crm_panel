import { ApiProperty } from "@nestjs/swagger";

import {
  IsInt,
  IsNotEmpty,
  IsString,
  IsMilitaryTime,
} from "class-validator";

export class CreateGroupDto {
  @ApiProperty({
    example: "Backend-101",
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    example: "Backend Development",
  })
  @IsString()
  @IsNotEmpty()
  course!: string;

  @ApiProperty({
    example: "Dushanba / Chorshanba / Juma",
  })
  @IsString()
  @IsNotEmpty()
  days!: string;

  @ApiProperty({
    example: "18:00",
  })
  @IsMilitaryTime()
  start_time!: string;

  @ApiProperty({
    example: "20:00",
  })
  @IsMilitaryTime()
  end_time!: string;

  @ApiProperty({
    example: 1,
    description: "Teacher ID",
  })
  @IsInt()
  teacher_id!: number;
}