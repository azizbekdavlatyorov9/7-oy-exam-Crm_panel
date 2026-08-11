import {
  Column,
  Entity,
} from 'typeorm';

import { BaseEntity } from 'src/database/entities/base.entity';
import { UserRole } from 'src/common/enums/user-role';

@Entity({ name: 'auth' })
export class Auth extends BaseEntity {
  @Column()
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role!: UserRole;

  @Column({ nullable: true })
  code!: string 

  @Column({
    type: 'bigint',
    nullable: true,
  })
  otpTime!: number

  @Column({ nullable: true })
  telegramChatId!: string;

  @Column({ nullable: true })
  telegramLinkCode!: string;
}
export { UserRole };

