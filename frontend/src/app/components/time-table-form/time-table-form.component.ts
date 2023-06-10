import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Section, Subject, TimeTable } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-time-table-form",
  templateUrl: "./time-table-form.component.html",
  styleUrls: ["./time-table-form.component.scss"],
})
export class TimeTableFormComponent implements OnInit {
  form: FormGroup;
  sections: Section[];
  subjects: Subject[];

  _timeTableId = -1;

  @Input()
  timeTables: TimeTable[];

  @Input()
  days: string[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  get timeTableId() {
    return this._timeTableId;
  }

  @Input()
  set timeTableId(id: number) {
    this._timeTableId = id;
    this.timeTableIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/time-tables/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
          this.getDay(data.sectionId);
          this.form.controls["sectionId"].disable();
        });
    else this.form.controls["sectionId"].enable();
  }

  @Output()
  timeTableIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      day: [null, [Validators.required]],
      sectionId: [null, [Validators.required]],
      yearId: [null, [Validators.required]],
      period1SubjectId: [null, [Validators.required]],
      period2SubjectId: [null, [Validators.required]],
      period3SubjectId: [null, [Validators.required]],
      period4SubjectId: [null, [Validators.required]],
      period5SubjectId: [null, [Validators.required]],
      period6SubjectId: [null, [Validators.required]],
      period7SubjectId: [null, [Validators.required]],
      period8SubjectId: [null, [Validators.required]],
    });

    this.form.controls["day"].disable();

    if (this.timeTableId === -1)
      this.form.controls["sectionId"].valueChanges.subscribe((secId) => {
        if (secId) this.form.controls["day"].enable();
        else this.form.controls["day"].disable();
        this.getDay(secId);
      });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/sections`).subscribe((data: any) => {
      this.sections = data;
    });
    this.http.get(`${environment.apiUrl}/subjects`).subscribe((data: any) => {
      this.subjects = data;
    });
  }

  getDay(secId: number) {
    this.days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
    let secTT = this.timeTables?.filter((tt) => tt.sectionId === secId);
    secTT?.forEach(
      (sTT) => (this.days = this.days.filter((d) => d != sTT.day))
    );
    let selectedDay = this.form.controls["day"].value;
    if (selectedDay && !this.days.includes(selectedDay))
      this.days.push(selectedDay);
  }

  resetForm() {
    this.timeTableId = -1;
    this.form.reset();
    this.form.controls["day"].disable();
  }

  submit() {
    if (this.form.valid) {
      console.log(this.timeTableId);
      if (this.timeTableId === -1)
        this.http
          .post(`${environment.apiUrl}/time-tables`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Time Table added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/time-tables/${this.timeTableId}`, {
            id: this.timeTableId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Time Table updated successfully");
            this.timeTableId = -1;
            this.form.reset();
            this.onFormSubmit.emit();
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
