import { ReportsService } from './reports.service';
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import CreateReportDto from './dtos/create-report.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { User } from 'src/users/user.entity';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { ReportDto } from './dtos/report.dto';
import { ApproveReportDto } from './dtos/approve-report.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import GetEstimateDto from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController { 
    constructor(private reportService: ReportsService) {}
    @Post()
    @UseGuards(AuthGuard)
    @Serialize(ReportDto)
    createReport(@Body() body: CreateReportDto, @CurrentUser() user: User ) {
        return this.reportService.create(body, user);
    }

    @Patch('/:id')
    @UseGuards(AdminGuard)
    approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
        return this.reportService.changeApproval(id, body.approved);
    }

    @Get()
    @UseGuards(AuthGuard) 
    getEstimate(@Query() query: GetEstimateDto) {
        return this.reportService.getEstimate(query);
    }
}
