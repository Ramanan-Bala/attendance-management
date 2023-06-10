import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { uploadCsv } from "src/app/helpers";
import { Mentor, Section, Student } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-students",
  templateUrl: "./students.component.html",
  styleUrls: ["./students.component.scss"],
  animations: [FadeInOut],
})
export class StudentsComponent implements OnInit {
  students: Student[];
  mentors: any[] = [{ text: "Not Assigned", value: null }];

  isLoading = false;

  total: number;
  pageSize = 10;
  pageIndex = 1;
  filter = [];

  studentId = -1;

  sections: Section[];

  section = new FormControl(null, [Validators.required]);
  year = new FormControl(null, [Validators.required]);

  _search = "";
  debounce: any;

  public get search(): string {
    return this._search;
  }

  public set search(v: string) {
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => {
      this._search = v;
      this.getStudents();
    }, 300);
  }

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
    this.http
      .get<Section[]>(`${environment.apiUrl}/sections`)
      .subscribe((data: Section[]) => {
        this.sections = data;
      });
    this.http
      .get<Mentor[]>(`${environment.apiUrl}/users`)
      .subscribe((users) => {
        users.map((u) => {
          this.mentors.push({ text: u.name, value: u.id });
        });
      });
  }

  getStudents(p?: any) {
    let params = new HttpParams()
      .append("page", `${this.pageIndex}`)
      .append("size", `${this.pageSize}`)
      .append("search", `${this.search}`);
    let url = `${environment.apiUrl}/students/page?page=${this.pageIndex}&size=${this.pageSize}&search=${this.search}`;
    if (p) this.filter = p.filter;

    if (this.filter) {
      url += `&filter[]=${this.filter}`;
      this.filter.forEach((filter: { value: any[]; key: string }) => {
        filter.value.forEach((value) => {
          params = params.append(filter.key, value);
        });
      });
    }
    this.isLoading = !this.isLoading;
    this.http
      .get<{ data: Student[]; totalItems: number }>(
        `${environment.apiUrl}/students/page`,
        { params }
      )
      .subscribe(
        (res: { data: Student[]; totalItems: number }) => {
          this.isLoading = !this.isLoading;
          this.students = res.data;
          this.total = res.totalItems;
        },
        (err) => (this.isLoading = !this.isLoading)
      );
  }

  deleteStudent(id: number) {
    this.http
      .delete(`${environment.apiUrl}/students/${id}`)
      .subscribe((data: any) => {
        this.message.success("Student deleted successfully");
        this.getStudents();
      });
  }

  handleUpload(file: any) {
    uploadCsv(file).subscribe((students) => {
      students.forEach((s: any) => {
        s["sectionId"] = this.section.value;
        s["yearId"] = this.year.value;
        file.value = null;
      });
      this.http
        .post(`${environment.apiUrl}/students`, students)
        .subscribe((data: any) => {
          this.message.success("Students added successfully");
          this.getStudents();
        });
    });
  }
}
