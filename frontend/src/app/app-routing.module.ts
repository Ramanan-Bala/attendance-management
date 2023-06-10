import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { TimeTableComponent } from "./pages/time-table/time-table.component";
import { SubjectSectionHoursComponent } from "./pages/subject-section-hours/subject-section-hours.component";
import { StudentsComponent } from "./pages/students/students.component";
import { SubjectsComponent } from "./pages/subjects/subjects.component";
import { SectionsComponent } from "./pages/sections/sections.component";
import { HourlyAttendanceComponent } from "./pages/hourly-attendance/hourly-attendance.component";
import { DayAttendanceComponent } from "./pages/day-attendance/day-attendance.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminGuard, AuthGuard, MentorGuard } from "./helpers/auth.guard";
import { BaseLayoutComponent } from "./pages/base-layout/base-layout.component";
import { MentorComponent } from "./pages/mentor/mentor.component";

const routes: Routes = [
  {
    path: "",
    component: BaseLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "home",
        pathMatch: "full",
      },
      {
        path: "day-attendance",
        component: DayAttendanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "hourly-attendance",
        component: HourlyAttendanceComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "sections",
        component: SectionsComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "subjects",
        component: SubjectsComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "students",
        component: StudentsComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "total-hours",
        component: SubjectSectionHoursComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "time-tables",
        component: TimeTableComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "mentor",
        component: MentorComponent,
        canActivate: [AuthGuard, AdminGuard],
      },
      {
        path: "home",
        component: DashboardComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  {
    path: "",
    loadChildren: () =>
      import("./authentication/authentication.module").then(
        (m) => m.AuthenticationModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: "enabled",
      scrollOffset: [0, 0],
      anchorScrolling: "enabled",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
