import { BaseEntity } from "src/database/entities/base.entity";
import { Group } from "src/modules/groups/entities/group.entity";
import {
  Column,
  DeleteDateColumn,
  Entity,
  OneToMany,
} from "typeorm";


@Entity({ name: "Teachers" })
export class Teacher extends BaseEntity {
  @Column()
  full_name!: string;

  @Column()
  phone_number!: string;

  @Column()
  profession!: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ nullable: true })
  picture?: string;

  @OneToMany(
    () => Group,
    (group) => group.teacher,
  )
  groups!: Group[];

  @DeleteDateColumn()
  leftAt?: Date;
}