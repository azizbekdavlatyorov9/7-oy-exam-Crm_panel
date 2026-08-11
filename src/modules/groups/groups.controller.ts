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
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";

import { GroupsService } from "./groups.service";

import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";
import { AuthGuard } from "src/common/guards/auth.guard";


@ApiTags("Groups")
@ApiBearerAuth()
@Controller("groups")
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
  ) {}

  // CREATE
  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Create group",
  })
  @ApiResponse({
    status: 201,
    description: "Group successfully created",
  })
  create(
    @Body()
    createGroupDto: CreateGroupDto,
  ) {
    return this.groupsService.create(
      createGroupDto,
    );
  }

  // FIND ALL
  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get all groups",
  })
  findAll() {
    return this.groupsService.findAll();
  }

  // FIND ONE
  @Get(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Get group by id",
  })
  findOne(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.groupsService.findOne(
      id,
    );
  }

  // UPDATE
  @Patch(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Update group",
  })
  update(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,

    @Body()
    updateGroupDto: UpdateGroupDto,
  ) {
    return this.groupsService.update(
      id,
      updateGroupDto,
    );
  }

  // DELETE
  @Delete(":id")
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: "Delete group",
  })
  remove(
    @Param(
      "id",
      ParseIntPipe,
    )
    id: number,
  ) {
    return this.groupsService.remove(
      id,
    );
  }
}