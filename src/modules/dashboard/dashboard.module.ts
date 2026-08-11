import {
  Module,
} from '@nestjs/common';

import {
  TypeOrmModule,
} from '@nestjs/typeorm';

import { DashboardController } from './dashboard.controller';

import { DashboardService } from './dashboard.service';

import { Students } from '../students/entities/student.entity';

import { Auth } from '../auth/entities/auth.entity';

import { Group } from '../groups/entities/group.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Students,
      Auth,
      Group,
    ]),
  ],

  controllers: [
    DashboardController,
  ],

  providers: [
    DashboardService,
  ],
})
export class DashboardModule {}