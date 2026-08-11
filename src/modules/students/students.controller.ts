import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseIntPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';

import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { CreateStudentFileDto } from './dto/create-student-file.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { StudentResponseDto } from './dto/student-response.dto';
import { AuthGuard } from 'src/common/guards/auth.guard';

@ApiTags('Students')
@ApiBearerAuth('JWT-auth')
@UseGuards(AuthGuard)
@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Yangi o\'quvchi qo\'shish' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStudentFileDto })
  @ApiResponse({ status: 201, type: StudentResponseDto })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  create(
    @Body() dto: CreateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentsService.create(dto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Barcha o\'quvchilar ro\'yxati' })
  @ApiResponse({ status: 200, type: [StudentResponseDto] })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Bitta o\'quvchi ma\'lumoti' })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  @ApiResponse({ status: 404, description: 'O\'quvchi topilmadi' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'O\'quvchi ma\'lumotlarini yangilash' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateStudentFileDto })
  @ApiResponse({ status: 200, type: StudentResponseDto })
  @UseInterceptors(
    FileInterceptor('picture', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateStudentDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.studentsService.update(id, dto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'O\'quvchini ro\'yxatdan chiqarish (soft delete)' })
  @ApiResponse({ status: 200, description: 'Muvaffaqiyatli o\'chirildi' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.remove(id);
  }

  @Patch(':id/restore')
  @ApiOperation({ summary: 'O\'chirilgan o\'quvchini qayta tiklash' })
  @ApiResponse({ status: 200, description: 'Qayta tiklandi' })
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.studentsService.restore(id);
  }
}