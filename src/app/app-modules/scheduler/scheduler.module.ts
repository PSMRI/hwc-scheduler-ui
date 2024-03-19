/*
 * AMRIT – Accessible Medical Records via Integrated Technology
 * Integrated EHR (Electronic Health Records) Solution
 *
 * Copyright (C) "Piramal Swasthya Management and Research Institute"
 *
 * This file is part of AMRIT.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see https://www.gnu.org/licenses/.
 */
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../core/core.module';
import { SchedulerRoutingModule } from './scheduler-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MaterialModule } from '../core/material.module';
import { NgChartsModule } from 'ng2-charts';
import { SchedulerService } from './shared/services/scheduler.service';
import { AppointmentViewComponent } from './appointment-view/appointment-view.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './mystaff/profile/profile.component';
import { MystaffComponent } from './mystaff/mystaff.component';
import { ChiefComplaintReportComponent } from './reports/chief-complaint-report/chief-complaint-report.component';
import { TotalConsultationReportComponent } from './reports/total-consultation-report/total-consultation-report.component';
import { CreateSmsTemplateComponent } from './sms-template/create-sms-template/create-sms-template.component';
import { SmsTemplateComponent } from './sms-template/sms-template.component';
import { ViewSmsTemplateComponent } from './sms-template/view-sms-template/view-sms-template.component';
import { TimesheetComponent } from './timesheet/timesheet.component';
import { SpecializationCalanderViewComponent } from './specialization-calander-view/specialization-calander-view.component';
import { SmsTemplateListComponent } from './sms-template/sms-template-list/sms-template-list.component';
import { ConsultationReportComponent } from './reports/consultation-report/consultation-report.component';
import { MonthlyReportComponent } from './reports/monthly-report/monthly-report.component';
import { DailyReportComponent } from './reports/daily-report/daily-report.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { WebcamModule } from 'ngx-webcam';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTabsModule } from '@angular/material/tabs';
import { FullCalendarModule } from '@fullcalendar/angular';


@NgModule({
  imports: [
    CommonModule,
    SchedulerRoutingModule,
    MatTableModule,
    MaterialModule,
    FullCalendarModule,
    NgChartsModule,
    MaterialModule,
    RouterModule,
    FormsModule,
    MatDialogModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatTooltipModule,
    MatPaginatorModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatRadioModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatListModule,
    MatSelectModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatGridListModule,
    WebcamModule,
    NgChartsModule,
    MatSidenavModule,
    MatTabsModule,
    CoreModule.forRoot(),
  ],
  declarations: [
    DashboardComponent,
    TimesheetComponent,
    SpecializationCalanderViewComponent,
    AppointmentViewComponent,
    MystaffComponent,
    ProfileComponent,
    SmsTemplateComponent,
    SmsTemplateListComponent,
    CreateSmsTemplateComponent,
    ViewSmsTemplateComponent,
    ChiefComplaintReportComponent,
    TotalConsultationReportComponent,
    ConsultationReportComponent,
    MonthlyReportComponent,
    DailyReportComponent,
  ],
  providers: [
    SchedulerService
  ],
})
export class SchedulerModule {}
