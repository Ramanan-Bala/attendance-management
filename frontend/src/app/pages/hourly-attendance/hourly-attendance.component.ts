import { FadeInOut } from "../../animations";
import { HttpClient } from "@angular/common/http";
import { Component } from "@angular/core";

@Component({
  selector: "app-hourly-attendance",
  templateUrl: "./hourly-attendance.component.html",
  styleUrls: ["./hourly-attendance.component.scss"],
  animations: [FadeInOut],
})
export class HourlyAttendanceComponent {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {}
}
