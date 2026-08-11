import { BaseEntity } from "src/database/entities/base.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { Teacher } from "src/modules/teachers/entities/teacher.entity";

@Entity({ name: "Groups" })
export class Group extends BaseEntity {
  @Column()
  name!: string;

  @Column()
  course!: string;

  @Column()
  days!: string;

  @Column()
  start_time!: string;

  @Column()
  end_time!: string;

  @Column({
    nullable: true,
  })
  teacher_id?: number;

  @ManyToOne(
    () => Teacher,
    (teacher) => teacher.groups,
    {
      onDelete: "SET NULL",
      nullable: true,
    },
  )
  @JoinColumn({
    name: "teacher_id",
  })
  teacher?: Teacher;

  @DeleteDateColumn()
  deletedAt?: Date;
}