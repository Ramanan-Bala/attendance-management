import { FadeInOut } from "../../animations";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Subject } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-subject",
  templateUrl: "./subjects.component.html",
  styleUrls: ["./subjects.component.scss"],
  animations: [FadeInOut],
})
export class SubjectsComponent {
  subjects: Subject[];
  isLoading = false;

  id = -1;
  form: FormGroup;

  constructor(private http: HttpClient, private fb: FormBuilder) {
    this.form = fb.group({
      code: ["", [Validators.required]],
      name: ["", [Validators.required]],
    });
  }

  ngOnInit() {
    this.getSection();
  }

  getSection() {
    this.isLoading = !this.isLoading;
    this.http.get<Subject[]>(`${environment.apiUrl}/subjects`).subscribe(
      (data: Subject[]) => {
        this.isLoading = !this.isLoading;
        this.subjects = data;
      },
      (err) => (this.isLoading = !this.isLoading)
    );
  }

  submit() {
    if (this.form.valid) {
      if (this.id === -1)
        this.http
          .post(`${environment.apiUrl}/subjects`, this.form.value)
          .subscribe((data: any) => {
            this.form.reset();
            this.getSection();
          });
      else
        this.http
          .put(`${environment.apiUrl}/subjects/${this.id}`, {
            id: this.id,
            ...this.form.value,
          })
          .subscribe((data: any) => {
            this.id = -1;
            this.form.reset();
            this.getSection();
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

  delete(id: number) {
    this.http.delete(`${environment.apiUrl}/subjects/${id}`).subscribe(() => {
      this.getSection();
    });
  }

  edit(id: number, name: string, code: string) {
    this.id = id;
    this.form.setValue({ name, code });
  }
}
