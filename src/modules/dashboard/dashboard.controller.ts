import {
  Controller,
  Get,
  UseGuards,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { DashboardService } from './dashboard.service';
import { AuthGuard } from 'src/common/guards/auth.guard';


@ApiTags('Dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get dashboard statistics',
  })
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('monthly')
  @UseGuards(AuthGuard)
  @ApiOperation({
    summary: 'Get monthly statistics',
  })
  getMonthlyStatistics() {
    return this.dashboardService.getMonthlyStatistics();
  }
}