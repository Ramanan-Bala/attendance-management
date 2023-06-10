import { NzMessageService } from "ng-zorro-antd/message";
import { FadeInOut } from "../../animations";
import { HttpClient } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { Mentor } from "src/app/models";

import { environment } from "src/environments/environment";

@Component({
  selector: "app-mentor",
  templateUrl: "./mentor.component.html",
  styleUrls: ["./mentor.component.scss"],
  animations: [FadeInOut],
})
export class MentorComponent implements OnInit {
  mentors: Mentor[];
  mentorId = -1;
  isLoading = false;

  pageSize = 10;
  pageIndex = 1;
  total: number;

  constructor(private http: HttpClient, private message: NzMessageService) {}
  ngOnInit(): void {
    this.getMentors();
  }

  getMentors() {
    this.isLoading = !this.isLoading;
    this.http.get<Mentor[]>(`${environment.apiUrl}/users`).subscribe(
      (res: Mentor[]) => {
        this.mentors = res;
        this.isLoading = !this.isLoading;
        this.total = res.length;
      },
      (err) => (this.isLoading = !this.isLoading)
    );
  }

  deleteMentor(id: number) {
    this.http
      .delete(`${environment.apiUrl}/users/${id}`)
      .subscribe((data: any) => {
        this.message.success("Mentor deleted successfully");
        this.getMentors();
      });
  }
}
