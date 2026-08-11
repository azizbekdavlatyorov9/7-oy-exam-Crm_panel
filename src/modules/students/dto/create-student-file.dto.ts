import { ApiProperty } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class CreateStudentFileDto extends CreateStudentDto{
  @ApiProperty({type:"string", format: "binary"})
  picture!:string

} 