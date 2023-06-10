import { NgZorroModule } from "./../NgZorro.module";
import { RouterModule } from "@angular/router";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { SiderComponent } from "./sider/sider.component";
import { DayAttendanceFormComponentOld } from "./day-attendance-form-old/day-attendance-form.component";
import { CalendarComponent } from "./calendar/calendar.component";
import { HourlyAttendanceFormComponent } from "./hourly-attendance-form/hourly-attendance-form.component";
import { ChartComponent } from "./chart/chart.component";
import { StudentFormComponent } from "./student-form/student-form.component";
import { TimeTableFormComponent } from "./time-table-form/time-table-form.component";
import { MentorFormComponent } from "./mentor-form/mentor-form.component";
import { DayAttendanceFormComponent } from "./day-attendance-form/day-attendance-form.component";

@NgModule({
  declarations: [
    SiderComponent,
    DayAttendanceFormComponentOld,
    CalendarComponent,
    HourlyAttendanceFormComponent,
    ChartComponent,
    StudentFormComponent,
    TimeTableFormComponent,
    MentorFormComponent,
    DayAttendanceFormComponent,
  ],
  exports: [
    SiderComponent,
    DayAttendanceFormComponentOld,
    HourlyAttendanceFormComponent,
    CalendarComponent,
    ChartComponent,
    StudentFormComponent,
    TimeTableFormComponent,
    MentorFormComponent,
    DayAttendanceFormComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NgZorroModule,
  ],
})
export class ComponentsModule {}
