import { BaseEntity } from "src/database/entities/base.entity";
import { Column, DeleteDateColumn, Entity } from "typeorm";

@Entity({ name: "Students" })
export class Students extends BaseEntity {
  @Column()
  full_name!: string;

  @Column()
  phone_number!: string;

  @Column()
  profession!: string;

  @Column()
  parent_name!: string;

  @Column()
  parent_number!: string;

  @Column()
  picture!: string;

  @DeleteDateColumn()
  leftAt?: Date;
}
