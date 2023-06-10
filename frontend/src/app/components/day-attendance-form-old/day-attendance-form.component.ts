import { NzMessageService } from "ng-zorro-antd/message";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { DataService } from "src/app/helpers/data.service";
import { formatDate } from "@angular/common";
import { HttpClient } from "@angular/common/http";
import { Student } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "day-attendance-form-old",
  templateUrl: "./day-attendance-form.component.html",
  styleUrls: ["./day-attendance-form.component.scss"],
})
export class DayAttendanceFormComponentOld implements OnInit {
  form: FormGroup;
  // reasonForm: FormGroup;

  students: Student[];
  absentees: any[] = [];
  user = JSON.parse(String(localStorage.getItem("user")));

  isLoading: boolean;
  constructor(
    private fb: FormBuilder,
    private data: DataService,
    private http: HttpClient,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    // this.reasonForm = this.fb.group({
    //   id: null,
    //   reason: ["", [Validators.required]],
    // });

    this.form = this.fb.group({
      id: null,
      department: [{ value: "CSE", disabled: true }, [Validators.required]],
      studentId: [null, [Validators.required]],
      date: [null, [Validators.required]],
      isAbsent: [true, [Validators.required]],
    });
    // this.data.getDate().subscribe((date) => {
    //   this.form.controls["date"].setValue(date);
    // });

    this.form.controls["date"].valueChanges.subscribe((date) => {
      this.getStudents();
    });
    this.form.controls["date"].setValue(new Date());
  }

  getStudents() {
    this.isLoading = true;
    let Fdate = formatDate(
      this.form.controls["date"].value,
      "yyyy-MM-dd",
      "en"
    );
    this.http
      .get<Student[]>(
        `${environment.apiUrl}/students/day-present?mentor=${this.user.id}&date=${Fdate}`
      )
      .subscribe(
        (data: any) => {
          this.isLoading = false;
          this.students = data.preStudents;
          this.absentees = data.absStudents;
          if (data.preStudents.length > 0)
            this.form.controls["studentId"].enable();
          else this.form.controls["studentId"].disable();
        },
        (err) => (this.isLoading = false)
      );
    // this.http
    //   .get(`${environment.apiUrl}/reason/${this.user.id}?date=${Fdate}`)
    //   .subscribe((res: any) => {
    //     this.reasonForm.reset();
    //     this.reasonForm.patchValue(res);
    //     console.log(this.reasonForm.value);
    //   });
  }

  deleteAttendance(id: number) {
    this.http
      .delete(`${environment.apiUrl}/day-attendances/${id}`)
      .subscribe((data) => {
        this.message.success("Attendance deleted successfully");
        this.getStudents();
      });
  }

  submit() {
    if (this.form.valid && this.form.controls["studentId"].value.length > 0) {
      let data = this.form.getRawValue();
      data.date = formatDate(data.date, "yyyy-MM-dd", "en");
      this.http
        .post(`${environment.apiUrl}/day-attendances`, {
          ...data,
          mentorId: this.user.id,
        })
        .subscribe((data) => {
          this.message.success("Attendance added successfully");
          this.getStudents();
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
    // if (this.reasonForm.valid) {
    //   let reason = this.reasonForm.value;
    //   let data = this.form.getRawValue();
    //   reason.date = formatDate(data.date, "yyyy-MM-dd", "en");
    //   reason.mentorId = this.user.id;
    //   if (reason.id)
    //     this.http
    //       .put(`${environment.apiUrl}/reason/${reason.id}`, reason)
    //       .subscribe(() => {
    //         console.log(reason);
    //       });
    //   else
    //     this.http.post(`${environment.apiUrl}/reason`, reason).subscribe(() => {
    //       console.log(reason);
    //     });
    // }
  }
}
