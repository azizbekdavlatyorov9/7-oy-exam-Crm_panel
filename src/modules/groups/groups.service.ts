import {
  Injectable,
  NotFoundException,
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { Group } from "./entities/group.entity";
import { Teacher } from "../teachers/entities/teacher.entity";

import { CreateGroupDto } from "./dto/create-group.dto";
import { UpdateGroupDto } from "./dto/update-group.dto";

@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,

    @InjectRepository(Teacher)
    private readonly teacherRepo: Repository<Teacher>,
  ) {}

  // CREATE
  async create(
    createGroupDto: CreateGroupDto,
  ) {
    const teacher =
      await this.teacherRepo.findOne({
        where: {
          id: createGroupDto.teacher_id,
        },
      });

    if (!teacher) {
      throw new NotFoundException(
        "Teacher not found",
      );
    }

    const group =
      this.groupRepo.create(
        createGroupDto,
      );

    return await this.groupRepo.save(
      group,
    );
  }

  // FIND ALL
  async findAll() {
    return await this.groupRepo.find({
      relations: {
        teacher: true,
      },
    });
  }

  // FIND ONE
  async findOne(id: number) {
    const group =
      await this.groupRepo.findOne({
        where: {
          id,
        },

        relations: {
          teacher: true,
        },
      });

    if (!group) {
      throw new NotFoundException(
        "Group not found",
      );
    }

    return group;
  }

  // UPDATE
  async update(
    id: number,
    updateGroupDto: UpdateGroupDto,
  ) {
    const group =
      await this.groupRepo.findOne({
        where: {
          id,
        },
      });

    if (!group) {
      throw new NotFoundException(
        "Group not found",
      );
    }

    if (
      updateGroupDto.teacher_id
    ) {
      const teacher =
        await this.teacherRepo.findOne({
          where: {
            id: updateGroupDto.teacher_id,
          },
        });

      if (!teacher) {
        throw new NotFoundException(
          "Teacher not found",
        );
      }
    }

    Object.assign(
      group,
      updateGroupDto,
    );

    return await this.groupRepo.save(
      group,
    );
  }

  // DELETE
  async remove(id: number) {
    const group =
      await this.groupRepo.findOne({
        where: {
          id,
        },
      });

    if (!group) {
      throw new NotFoundException(
        "Group not found",
      );
    }

    await this.groupRepo.softRemove(
      group,
    );

    return {
      message:
        "Group deleted successfully",
    };
  }
}