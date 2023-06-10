import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Section } from "./../../models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-student-form",
  templateUrl: "./student-form.component.html",
  styleUrls: ["./student-form.component.scss"],
})
export class StudentFormComponent implements OnInit {
  sections: Section[];
  form: FormGroup;

  _studentId = -1;

  get studentId() {
    return this._studentId;
  }

  @Input()
  set studentId(id: number) {
    this._studentId = id;
    this.studentIdChange.emit(id);
    if (id > 0)
      this.http
        .get(`${environment.apiUrl}/students/${id}`)
        .subscribe((data: any) => {
          this.form.patchValue(data);
        });
  }

  @Output()
  studentIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      name: ["", [Validators.required]],
      regNo: ["", [Validators.required]],
      rollNo: ["", [Validators.required]],
      yearId: [null, [Validators.required]],
      sectionId: ["", [Validators.required]],
      parentMobile: ["", [Validators.required]],
      studentMobile: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.http.get(`${environment.apiUrl}/sections`).subscribe((data: any) => {
      this.sections = data;
    });
  }

  submit() {
    if (this.form.valid) {
      if (this.studentId === -1)
        this.http
          .post(`${environment.apiUrl}/students`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Student added successfully");
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/students/${this.studentId}`, {
            id: this.studentId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Student updated successfully");
            this.studentId = -1;
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
