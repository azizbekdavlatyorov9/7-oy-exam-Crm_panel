import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from "@nestjs/swagger";

import { TeachersService } from "./teachers.service";

import { CreateTeacherDto } from "./dto/create-teacher.dto";
import { UpdateTeacherDto } from "./dto/update-teacher.dto";
import { AuthGuard } from "src/common/guards/auth.guard";


@ApiTags("Teachers")
@ApiBearerAuth()
@Controller("teachers")
export class TeachersController {
  constructor(
    private readonly teachersService: TeachersService,
  ) {}

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create teacher",
  })
  create(
    @Body()
    createTeacherDto: CreateTeacherDto,
  ) {
    return this.teachersService.create(
      createTeacherDto,
    );
  }

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get all teachers",
  })
  findAll() {
    return this.teachersService.findAll();
  }

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
    return this.teachersService.findOne(
      id,
    );
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update teacher",
  })
  update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    updateTeacherDto: UpdateTeacherDto,
  ) {
    return this.teachersService.update(
      id,
      updateTeacherDto,
    );
  }

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
    return this.teachersService.remove(
      id,
    );
  }
}