import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';

import { Students } from './entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Students)
    private readonly studentsRepo: Repository<Students>,
  ) {}

  async create(dto: CreateStudentDto, file?: Express.Multer.File) {
    const student = this.studentsRepo.create({
      ...dto,
      picture: file ? file.filename : '',
    });
    return this.studentsRepo.save(student);
  }

  async findAll() {
    return this.studentsRepo.find({ order: { id: 'DESC' } });
  }

  async findOne(id: number) {
    const student = await this.studentsRepo.findOne({ where: { id } });
    if (!student) {
      throw new NotFoundException('O\'quvchi topilmadi');
    }
    return student; 
  }

  async update(id: number, dto: UpdateStudentDto, file?: Express.Multer.File) {
    const student = await this.findOne(id);

    if (file) {
      // Eski rasmni o'chirish
      if (student.picture) {
        const oldPath = path.join('uploads', student.picture);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      student.picture = file.filename;
    }

    Object.assign(student, dto);
    return this.studentsRepo.save(student);
  }

  async remove(id: number) {
    const student = await this.findOne(id);
    await this.studentsRepo.softDelete(id); // leftAt ga sana yoziladi
    return { message: `${student.full_name} o'quvchilar ro'yxatidan chiqarildi` };
  }

  async restore(id: number) {
    const student = await this.studentsRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!student) {
      throw new NotFoundException('O\'quvchi topilmadi');
    }
    if (!student.leftAt) {
      throw new BadRequestException('Bu o\'quvchi allaqachon faol');
    }
    await this.studentsRepo.restore(id);
    return { message: 'O\'quvchi qayta tiklandi' };
  }
}