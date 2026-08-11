import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";


@Entity("users")
export class User {
  @Column()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  username!: string;

  @Column({
    unique: true,
  })
  email!: string;

  @Column()
  password!: string;

  @Column({
    nullable: true,
  })
  code!: string;

  @Column({
    nullable: true,
    type: "bigint",
  })
  otpTime!: number;

  @Column({
    default: false,
  })
  isVerified!: boolean;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}