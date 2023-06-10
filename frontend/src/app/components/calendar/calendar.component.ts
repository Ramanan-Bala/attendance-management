import { DataService } from "src/app/helpers/data.service";
import { formatDate } from "@angular/common";
import { Component, EventEmitter, OnInit, Output, Input } from "@angular/core";
import { dateToString } from "src/app/helpers";

interface Calendar {
  date: number;
  month: number;
  year: number;
  fullDate: Date;
  isDisabled: boolean;
}

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"],
})
export class CalendarComponent implements OnInit {
  today = new Date();

  selectedDate: Date;

  dateToString = dateToString;

  private _date = new Date();
  get date(): Date {
    return this._date;
  }
  set date(date: Date) {
    this._date = date;

    this.firstDayIndex = new Date(
      date.getFullYear(),
      date.getMonth(),
      1
    ).getDay();

    this.lastDayIndex = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();
  }

  firstDayIndex = new Date(
    this.date.getFullYear(),
    this.date.getMonth(),
    1
  ).getDay();

  lastDayIndex = new Date(
    this.date.getFullYear(),
    this.date.getMonth() + 1,
    0
  ).getDate();

  previousDayCount: any[];
  calendarDates: Calendar[];

  months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  constructor(private data: DataService) {}

  ngOnInit() {
    this.setCalendar({
      month: this.today.getMonth(),
      year: this.today.getFullYear(),
      date: this.today.getDate(),
    });
  }

  setCalendar(data: any) {
    let { month, year, date } = data;
    let currentDate = this.date;

    if (date) currentDate.setDate(date);
    else if (
      this.today.getMonth() == month &&
      this.today.getFullYear() == this.date.getFullYear()
    )
      currentDate.setDate(this.today.getDate());
    else currentDate.setDate(1);

    currentDate.setMonth(month);

    if (year) currentDate.setFullYear(year);

    this.date = currentDate;

    this.selectedDate = currentDate;
    this.data.setDate(this.selectedDate);

    this.previousDayCount = Array(this.firstDayIndex);
    this.calendarDates = this.generateCalendar(1, this.lastDayIndex);
  }

  generateCalendar(start: number, end: number): Calendar[] {
    return Array(end - start + 1)
      .fill(0)
      .map((_, idx) => {
        let year = this.date.getFullYear();
        let month = this.date.getMonth();
        let date: any = start + idx;
        let fullDate = new Date(year, month, date);
        let isDisabled = fullDate.getDay() === 0 ? true : false;
        return {
          date,
          month,
          year,
          fullDate,
          isDisabled,
        };
      });
  }

  onCalendarChange(date: Date, isDisabled: boolean) {
    const dateString = formatDate(date, "yyyy-MM-dd", "en");
    this.selectedDate = date;
    if (!isDisabled) this.data.setDate(this.selectedDate);
  }
}
