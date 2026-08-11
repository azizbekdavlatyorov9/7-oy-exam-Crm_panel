import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import {
  FileInterceptor,
} from "@nestjs/platform-express";

import {
  diskStorage,
} from "multer";

import * as path from "path";

import { TeachersService } from "./teachers.service";
import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";
import { AuthGuard } from "src/common/guards/auth.guard";


@ApiTags("Teachers")
@ApiBearerAuth(`JWT-auth`)
@Controller("teachers")
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
  ) {}

  // ================= CREATE =================

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create teacher",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("picture", {
      storage: diskStorage({
        destination: path.join(
          process.cwd(),
          "uploads",
        ),

        filename: (
          req,
          file,
          cb,
        ) => {
          const uniqueSuffix =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;

          const ext =
            path.extname(
              file.originalname,
            );

          cb(
            null,
            `teacher-${uniqueSuffix}${ext}`,
          );
        },
      }),
    }),
  )
  create(
    @Body()
    createTeacherDto: CreateTeacherDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.teachersService.create(
      createTeacherDto,
      file,
    );
  }

  // ================= GET ALL =================

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get all teachers",
  })
  findAll() {
    return this.teachersService.findAll();
  }

  // ================= GET ONE =================

  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get teacher by id",
  })
  findOne(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.teachersService.findOne(id);
  }

  // ================= UPDATE =================

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update teacher",
  })
  @ApiConsumes("multipart/form-data")
  @UseInterceptors(
    FileInterceptor("picture", {
      storage: diskStorage({
        destination: path.join(
          process.cwd(),
          "uploads",
        ),

        filename: (
          req,
          file,
          cb,
        ) => {
          const uniqueSuffix =
            `${Date.now()}-${Math.round(
              Math.random() * 1e9,
            )}`;

          const ext =
            path.extname(
              file.originalname,
            );

          cb(
            null,
            `teacher-${uniqueSuffix}${ext}`,
          );
        },
      }),
    }),
  )
  update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    updateTeacherDto: UpdateTeacherDto,

    @UploadedFile()
    file: Express.Multer.File,
  ) {
    return this.teachersService.update(
      id,
      updateTeacherDto,
      file,
    );
  }

  // ================= DELETE =================

  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Delete teacher",
  })
  remove(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.teachersService.remove(id);
  }
}