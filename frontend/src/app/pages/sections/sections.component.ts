import { FadeInOut } from "../../animations";
import { FormControl, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Section } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-section",
  templateUrl: "./sections.component.html",
  styleUrls: ["./sections.component.scss"],
  animations: [FadeInOut],
})
export class SectionsComponent implements OnInit {
  sections: Section[];
  isLoading = false;

  id = -1;
  section = new FormControl("", [Validators.required]);

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getSection();
  }

  getSection() {
    this.isLoading = !this.isLoading;
    this.http.get<Section[]>(`${environment.apiUrl}/sections`).subscribe(
      (data: Section[]) => {
        this.isLoading = !this.isLoading;
        this.sections = data;
      },
      (err) => (this.isLoading = !this.isLoading)
    );
  }

  submit() {
    if (this.section.valid) {
      if (this.id === -1)
        this.http
          .post(`${environment.apiUrl}/sections`, {
            name: this.section.value,
          })
          .subscribe((data: any) => {
            this.section.reset();
            this.getSection();
          });
      else
        this.http
          .put(`${environment.apiUrl}/sections/${this.id}`, {
            id: this.id,
            name: this.section.value,
          })
          .subscribe((data: any) => {
            this.id = -1;
            this.section.reset();
            this.getSection();
          });
    } else {
      this.section.markAsDirty();
      this.section.updateValueAndValidity({ onlySelf: true });
    }
  }

  delete(id: number) {
    this.http.delete(`${environment.apiUrl}/sections/${id}`).subscribe(() => {
      this.getSection();
    });
  }

  edit(id: number, name: string) {
    this.id = id;
    this.section.setValue(name);
  }
}
