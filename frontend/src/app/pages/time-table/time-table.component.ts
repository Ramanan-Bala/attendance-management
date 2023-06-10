import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { TimeTable } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-time-table",
  templateUrl: "./time-table.component.html",
  styleUrls: ["./time-table.component.scss"],
  animations: [FadeInOut],
})
export class TimeTableComponent implements OnInit {
  timeTables: TimeTable[];
  isLoading = false;

  timeTableId = -1;

  constructor(private http: HttpClient, private message: NzMessageService) {}

  ngOnInit(): void {
    this.getTimeTable();
  }

  getTimeTable() {
    this.isLoading = !this.isLoading;
    this.http.get<TimeTable[]>(`${environment.apiUrl}/time-tables`).subscribe(
      (data: TimeTable[]) => {
        this.isLoading = !this.isLoading;
        this.timeTables = data;
        console.log(data);
      },
      (err) => (this.isLoading = !this.isLoading)
    );
  }

  deleteTimeTable(id: number) {
    this.http
      .delete(`${environment.apiUrl}/time-tables/${id}`)
      .subscribe((data: any) => {
        this.message.success("Student added successfully");
        this.getTimeTable();
      });
  }
}
