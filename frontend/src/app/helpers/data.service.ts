import { Injectable } from "@angular/core";
import { Subject, Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataService {
  date = new Subject<Date>();

  constructor() {}
  setDate(data: Date) {
    this.date.next(data);
  }

  getDate(): Observable<Date> {
    return this.date.asObservable();
  }
}
