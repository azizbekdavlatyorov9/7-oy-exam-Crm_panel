import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import {
  InjectRepository,
} from "@nestjs/typeorm";

import {
  Repository,
} from "typeorm";

import { Teacher } from "./entities/teacher.entity";

import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";

@Injectable()
export class TeachersService {
  constructor(
    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  // ================= CREATE =================

  async create(
    createTeacherDto: CreateTeacherDto,
    file: Express.Multer.File,
  ) {
    const teacher =
      this.teacherRepo.create({
        ...createTeacherDto,

        picture: file
          ? file.filename
          : "",
      });

    return await this.teacherRepo.save(
      teacher,
    );
  }

  // ================= FIND ALL =================

  async findAll() {
    return await this.teacherRepo.find();
  }

  // ================= FIND ONE =================

  async findOne(id: number) {
    const teacher =
      await this.teacherRepo.findOne({
        where: {
          id,
        },
      });

    if (!teacher) {
      throw new NotFoundException(
        "Teacher not found",
      );
    }

    return teacher;
  }

  // ================= UPDATE =================

  async update(
    id: number,
    updateTeacherDto: UpdateTeacherDto,
    file: Express.Multer.File,
  ) {
    const teacher =
      await this.findOne(id);

    Object.assign(
      teacher,
      updateTeacherDto,
    );

    if (file) {
      teacher.picture =
        file.filename;
    }

    return await this.teacherRepo.save(
      teacher,
    );
  }

  // ================= DELETE =================

  async remove(id: number) {
    const teacher =
      await this.findOne(id);

    await this.teacherRepo.softRemove(
      teacher,
    );

    return {
      message:
        "Teacher deleted successfully",
    };
  }
}