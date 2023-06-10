import { NzMessageService } from "ng-zorro-antd/message";
import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Student } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-mentor-form",
  templateUrl: "./mentor-form.component.html",
  styleUrls: ["./mentor-form.component.scss"],
})
export class MentorFormComponent implements OnInit {
  form: FormGroup;

  _mentorId = -1;

  get mentorId() {
    return this._mentorId;
  }

  @Input()
  set mentorId(id: number) {
    this._mentorId = id;
    this.mentorIdChange.emit(id);
    if (id > 0) {
      this.form.controls["password"].disable();
      this.http
        .get(`${environment.apiUrl}/users/${id}`)
        .subscribe((user: any) => {
          this.form.patchValue(user);
          this.students = user.students;
          let studentId: any[] = [];
          user.students.forEach((s: any) => {
            if (s.mentorId) studentId.push(s.id);
          });
          this.form.controls["studentId"].setValue(studentId);
        });
    } else this.form.controls["password"].enable();
  }

  @Output()
  mentorIdChange = new EventEmitter();

  @Output()
  onFormSubmit = new EventEmitter();

  students: Student[] = [];

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [
        "",
        [
          Validators.required,
          Validators.maxLength(13),
          Validators.minLength(8),
        ],
      ],
      studentId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {}

  submit() {
    if (this.form.valid) {
      if (this.mentorId === -1)
        this.http
          .post(`${environment.apiUrl}/users/register`, this.form.value)
          .subscribe((data: any) => {
            this.message.success("Mentor added successfully");
            this.students = [];
            this.form.reset();
            this.onFormSubmit.emit();
          });
      else
        this.http
          .put(`${environment.apiUrl}/users/${this.mentorId}`, {
            id: this.mentorId,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.message.success("Mentor updated successfully");
            this.mentorId = -1;
            this.students = [];
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
