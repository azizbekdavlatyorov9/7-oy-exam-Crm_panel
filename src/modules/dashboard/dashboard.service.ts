import {
  Injectable,
} from '@nestjs/common';

import {
  InjectRepository,
} from '@nestjs/typeorm';

import {
  Between,
  Repository,
} from 'typeorm';

import { Students } from '../students/entities/student.entity';
import { Auth } from '../auth/entities/auth.entity';

// Group entity sizda qanday nomlangan bo'lsa,
// shu yerda o'sha entityni import qilasiz.
import { Group } from '../groups/entities/group.entity';

@Injectable()
export class DashboardService {
  constructor(
    @InjectRepository(Students)
    private readonly studentRepo: Repository<Students>,

    @InjectRepository(Auth)
    private readonly authRepo: Repository<Auth>,

    @InjectRepository(Group)
    private readonly groupRepo: Repository<Group>,
  ) {}

  // ==========================================
  // DASHBOARD
  // ==========================================

  async getDashboard() {
    const now = new Date();

    // Jami aktiv o'quvchilar
    const students =
      await this.studentRepo.count();

    // Jami o'qituvchilar
    const teachers =
      await this.authRepo.count({
        where: {
          role: 'TEACHER' as any,
        },
      });

    // Jami guruhlar
    const groups =
      await this.groupRepo.count();

    // Shu oy tark etganlar
    const monthlyLeftStudents =
      await this.getMonthlyLeftStudents(
        now.getFullYear(),
        now.getMonth(),
      );

    // Shu oy yangi qo'shilganlar
    const monthlyNewStudents =
      await this.getMonthlyNewStudents(
        now.getFullYear(),
        now.getMonth(),
      );

    // Oxirgi 7 oy statistikasi
    const monthlyStatistics =
      await this.getMonthlyStatistics();

    return {
      students,
      teachers,
      monthlyLeftStudents,
      groups,

      monthlyStatistics,
    };
  }

  // ==========================================
  // SHU OY TARK ETGAN STUDENTLAR
  // ==========================================

  private async getMonthlyLeftStudents(
    year: number,
    month: number,
  ) {
    const start =
      new Date(
        year,
        month,
        1,
        0,
        0,
        0,
        0,
      );

    const end =
      new Date(
        year,
        month + 1,
        0,
        23,
        59,
        59,
        999,
      );

    return this.studentRepo.count({
      withDeleted: true,

      where: {
        leftAt: Between(
          start,
          end,
        ),
      },
    });
  }

  // ==========================================
  // SHU OY YANGI STUDENTLAR
  // ==========================================

  private async getMonthlyNewStudents(
    year: number,
    month: number,
  ) {
    const start =
      new Date(
        year,
        month,
        1,
        0,
        0,
        0,
        0,
      );

    const end =
      new Date(
        year,
        month + 1,
        0,
        23,
        59,
        59,
        999,
      );

    return this.studentRepo.count({
      where: {
        createdAt: Between(
          start,
          end,
        ),
      },
    });
  }

  // ==========================================
  // OYLIK STATISTIKA
  // ==========================================

  async getMonthlyStatistics() {
    const now = new Date();

    const result: any[] = [];

    // Oxirgi 7 oy
    for (let i = 6; i >= 0; i--) {
      const date =
        new Date(
          now.getFullYear(),
          now.getMonth() - i,
          1,
        );

      const year =
        date.getFullYear();

      const month =
        date.getMonth();

      const start =
        new Date(
          year,
          month,
          1,
          0,
          0,
          0,
          0,
        );

      const end =
        new Date(
          year,
          month + 1,
          0,
          23,
          59,
          59,
          999,
        );

      // Shu oyda qo'shilganlar
      const newStudents =
        await this.studentRepo.count({
          where: {
            createdAt: Between(
              start,
              end,
            ),
          },
        });

      // Shu oyda tark etganlar
      const leftStudents =
        await this.studentRepo.count({
          withDeleted: true,

          where: {
            leftAt: Between(
              start,
              end,
            ),
          },
        });

      result.push({
        month: this.getMonthName(month),
        year,

        newStudents,
        leftStudents,
      });
    }

    return result;
  }

  // ==========================================
  // MONTH NAME
  // ==========================================

  private getMonthName(
    month: number,
  ): string {
    const months = [
      'Yanvar',
      'Fevral',
      'Mart',
      'Aprel',
      'May',
      'Iyun',
      'Iyul',
      'Avgust',
      'Sentabr',
      'Oktabr',
      'Noyabr',
      'Dekabr',
    ];

    return months[month];
  }
}