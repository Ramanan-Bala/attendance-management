import {FadeInOut} from "./../../animations";
import {DataService} from "src/app/helpers/data.service";
import {formatDate} from "@angular/common";
import {HttpClient} from "@angular/common/http";
import {Component, EventEmitter, OnInit, Output} from "@angular/core";
import {TransferItem} from "ng-zorro-antd/transfer";
import {Section, Student} from "src/app/models";
import {environment} from "src/environments/environment";
import {NzMessageService} from "ng-zorro-antd/message";

@Component({
  selector: "day-attendance-form",
  templateUrl: "./day-attendance-form.component.html",
  styleUrls: ["./day-attendance-form.component.scss"],
  animations: [FadeInOut],
})
export class DayAttendanceFormComponent implements OnInit {
  list: Array<TransferItem & { rollNo: string; name: string }> = [];

  sections: Section[];

  selectedYear: string;
  selectedSection: string;

  user = JSON.parse(String(localStorage.getItem("user")));

  selectedDate: Date = new Date();

  students: Student[];
  absentees: any[] = [];

  @Output("getAbsentees")
  sendAbsentees = new EventEmitter();

  constructor(
    private http: HttpClient,
    private data: DataService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.http
      .get<Section[]>(`${environment.apiUrl}/sections`)
      .subscribe((data: Section[]) => {
        this.sections = data;
      });
    this.data.getDate().subscribe((date) => {
      this.selectedDate = date;
      this.getStudents();
    });
  }

  getStudents() {
    let Fdate = formatDate(this.selectedDate, "yyyy-MM-dd", "en");
    this.http
      .get<any>(
        `${environment.apiUrl}/students/day-present?mentor=${this.user.id}&date=${Fdate}&sec=${this.selectedSection}&year=${this.selectedYear}`
      )
      .subscribe((data: { preStudents: Student[]; absStudents: any[] }) => {
        this.students = data.preStudents;
        this.absentees = data.absStudents;
        this.sendAbsentees.emit(this.absentees);
        this.getData(data);
      });
  }

  getData(data: any): void {
    this.list = [];
    let { preStudents, absStudents } = data;
    preStudents.forEach((s: any) => {
      this.list.push({
        key: s.id,
        title: s.rollNo + "-" + s.name.toLowerCase() + s.name.toUpperCase(),
        direction: "left",
        rollNo: s.rollNo,
        name: s.name,
      });
    });
    absStudents.forEach((s: any) => {
      this.list.push({
        key: s.id,
        title:
          s.studentRollNo +
          "-" +
          s.studentName.toLowerCase() +
          s.studentName.toUpperCase(),
        direction: "right",
        rollNo: s.studentRollNo,
        name: s.studentName,
      });
    });
  }

  change(ret: any): void {
    if (ret.from === "left" && ret.to === "right") {
      let Fdate = formatDate(this.selectedDate, "yyyy-MM-dd", "en");
      let studentId: any = [];
      ret.list.forEach((student: any) => {
        studentId.push(student.key);
      });
      let data = {
        date: Fdate,
        isAbsent: true,
        studentId,
      };
      this.http
        .post(`${environment.apiUrl}/day-attendances`, data)
        .subscribe((data) => {
          this.message.success("Attendance added successfully");
          this.getStudents();
        });
    } else if (ret.from === "right" && ret.to === "left") {
      let id: any = [];
      ret.list.forEach((att: any) => {
        id.push(att.key);
      });
      this.http
        .delete(`${environment.apiUrl}/day-attendances?id=${id}`)
        .subscribe((data) => {
          this.message.success("Attendance deleted successfully");
          this.getStudents();
        });
    }
  }
}
