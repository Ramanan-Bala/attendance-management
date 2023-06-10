import { Observable } from "rxjs";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "src/app/helpers/data.service";
import { Section, Student } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "hourly-attendance-form",
  templateUrl: "./hourly-attendance-form.component.html",
  styleUrls: ["./hourly-attendance-form.component.scss"],
})
export class HourlyAttendanceFormComponent implements OnInit {
  form: FormGroup;

  sections: Section[];
  students: Student[];
  timeTables: any[];

  user = JSON.parse(String(localStorage.getItem("user")));

  _timeTable: any;

  get timeTable() {
    return this._timeTable;
  }

  set timeTable(tt: any) {
    this._timeTable = tt;
    if (!tt) this.form.controls["hour"].disable();
    else this.form.controls["hour"].enable();
  }

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private data: DataService
  ) {}
  ngOnInit(): void {
    this.form = this.fb.group({
      id: null,
      date: [{ value: null, disabled: true }, [Validators.required]],
      department: [{ value: "CSE", disabled: true }, [Validators.required]],
      studentId: [null, [Validators.required]],
      subjectId: [null, [Validators.required]],
      hour: [null, [Validators.required]],
      isAbsent: [true, [Validators.required]],
      sectionId: [null, [Validators.required]],
    });

    this.form.controls["subjectId"].disable();
    this.form.controls["studentId"].disable();

    this.data.getDate().subscribe((date) => {
      this.form.controls["date"].setValue(date);
    });

    this.http
      .get<Section[]>(`${environment.apiUrl}/sections`)
      .subscribe((sections: Section[]) => {
        this.sections = sections;
        this.form.controls["sectionId"].setValue(sections[0]?.id);
        this.form.controls["date"].setValue(new Date());
      });

    this.form.controls["sectionId"].valueChanges.subscribe((data) => {
      this.form.controls["hour"].reset();
      this.form.controls["subjectId"].reset();
      this.form.controls["studentId"].reset();
      this.students = [];
      if (data)
        this.getTimeTables(data).subscribe((timeTables) => {
          this.timeTables = timeTables;
          this.getTimeTable(this.form.controls["date"].value);
        });
    });

    this.form.controls["date"].valueChanges.subscribe((date) => {
      this.form.controls["subjectId"].reset();
      this.form.controls["hour"].reset();
      if (date) this.getTimeTable(date);
    });

    this.form.controls["hour"].valueChanges.subscribe((hour) => {
      let sec = this.form.controls["sectionId"];
      let sub = this.form.controls["subjectId"];
      let date = this.form.controls["date"];
      if (hour) {
        sub.setValue(this.timeTable["period" + hour + "SubjectId"]);
        this.getStudents(sec.value, hour, date.value);
      }
    });
  }

  getStudents(sec: number, period: number, date: string) {
    date = formatDate(date, "yyyy-MM-dd", "en");
    this.http
      .get<Student[]>(
        `${environment.apiUrl}/students/hour-present?mentor=${this.user.id}&hour=${period}&date=${date}`
      )
      .subscribe((data: Student[]) => {
        this.students = data;
        if (data.length > 0) this.form.controls["studentId"].enable();
        else this.form.controls["studentId"].disable();
      });
  }

  getTimeTable(date: Date) {
    let days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let day = days[date.getDay() - 1];
    if (this.timeTables)
      this.timeTable = this.timeTables.filter((t) => t.day === day)[0];
  }

  getTimeTables(sec: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/time-tables?sec=${sec}`);
  }

  getHours(sectionId: number) {}

  submit() {
    if (this.form.valid && this.form.controls["studentId"].value?.length > 0) {
      let data = this.form.getRawValue();
      data.date = formatDate(data.date, "yyyy-MM-dd", "en");
      this.http
        .post(`${environment.apiUrl}/hourly-attendances`, data)
        .subscribe((data) => {
          this.form.controls["hour"].reset();
          this.form.controls["subjectId"].reset();
          this.form.controls["studentId"].reset();
        });
    } else {
      Object.values(this.form.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
