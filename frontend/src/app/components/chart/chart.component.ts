import { formatDate } from "@angular/common";
import { environment } from "src/environments/environment";
import { HttpClient } from "@angular/common/http";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
} from "chart.js/auto";
import "chartjs-plugin-datalabels";

@Component({
  selector: "app-chart",
  templateUrl: "./chart.component.html",
  styleUrls: ["./chart.component.scss"],
})
export class ChartComponent implements OnInit {
  lineChart: any;
  barChart: any;
  doughNut: any;

  user = JSON.parse(String(localStorage.getItem("user")));
  dateRange: Date[];

  year = 1;
  _date: Date;

  get date() {
    return this._date;
  }

  set date(value: Date) {
    this._date = value;
    this.generateDonut();
  }

  config: any = {
    data: {
      // values on X-Axis
      labels: [],
      datasets: [
        {
          label: "Present",
          data: [],
          backgroundColor: "#22c55e",
          borderColor: "#22c55e",
        },
        {
          label: "Absent",
          data: [],
          backgroundColor: "#ef4444",
          borderColor: "#ef4444",
        },
      ],
    },
    options: {
      aspectRatio: 2.5,
    },
  };
  constructor(private http: HttpClient) {
    // this.isLoading = true;

    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip
    );
  }

  ngOnInit(): void {
    let plugins = {
      id: "doughnut",
      afterDraw: (chart: any) => {
        // Get ctx from string
        var ctx = chart.ctx;

        // Get options from the center object in options
        // var centerConfig = chart.config.options.elements.center;
        var fontStyle = "Arial";
        var txt = this.date.toDateString();
        var color = "#000";
        var sidePadding = 20;
        var sidePaddingCalculated =
          (sidePadding / 100) * (chart.innerRadius * 2);
        // Start with a base font of 30px
        ctx.font = "18px " + fontStyle;

        // Get the width of the string and also the width of the element minus 10 to give it 5px side padding
        var stringWidth = ctx.measureText(txt).width;
        var elementWidth = chart.innerRadius * 2 - sidePaddingCalculated;

        // Find out how much the font can grow in width.
        var widthRatio = elementWidth / stringWidth;
        var newFontSize = Math.floor(30 * widthRatio);
        var elementHeight = chart.innerRadius * 2;

        // Pick a new font size so it will not be larger than the height of label.
        var fontSizeToUse = Math.min(newFontSize, elementHeight, 20);
        var minFontSize = 20;
        var wrapText = false;

        if (minFontSize === undefined) {
          minFontSize = 20;
        }

        if (minFontSize && fontSizeToUse < minFontSize) {
          fontSizeToUse = minFontSize;
          wrapText = true;
        }

        // Set font settings to draw it correctly.
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        var centerX = (chart.chartArea.left + chart.chartArea.right) / 2;
        var centerY = (chart.chartArea.top + chart.chartArea.bottom) / 2;
        ctx.font = fontSizeToUse + "px " + fontStyle;
        ctx.fillStyle = color;

        if (!wrapText) {
          ctx.fillText(txt, centerX, centerY);
          return;
        }
        ctx.fillText(txt, centerX, centerY);
      },
    };

    this.date = new Date();

    let addedDate = new Date();
    addedDate.setDate(new Date().getDate() + 4);
    this.dateRange = [new Date(), addedDate];

    this.doughNut = new Chart("doughnut", {
      plugins: [plugins],
      type: "doughnut",
      data: {
        labels: ["Absent", "Present"],
        datasets: [
          {
            label: "Student",
            data: [0, 0],
            backgroundColor: ["rgb(255, 99, 132)", "rgb(54, 162, 235)"],
            hoverOffset: 4,
          },
        ],
      },
    });
    this.lineChart = new Chart("lineChart", {
      type: "line",
      ...this.config,
    });

    this.barChart = new Chart("barChart", {
      type: "bar",
      ...this.config,
    });
    this.generateChart([this.dateRange[0], this.dateRange[1]]);
  }

  generateChart(date: Date[]) {
    let startDate = formatDate(date[0], "yyyy-MM-dd", "en");
    let endDate = formatDate(date[1], "yyyy-MM-dd", "en");
    this.config.data.labels = [];
    this.config.data.datasets[0].data = [];
    this.config.data.datasets[1].data = [];

    let params = ``;
    if (this.user.role === "MENTOR") params = `mentorId=${this.user.id}`;
    else params = `year=${this.year}`;

    this.http
      .get(
        `${environment.apiUrl}/report/dashboard/range?${params}&startDate=${startDate}&endDate=${endDate}`
      )
      .subscribe((res: any) => {
        res.forEach((data: any) => {
          this.config.data.labels.push(data.date);
          this.config.data.datasets[0].data.push(
            data.totalStudent - data.totalAbsent
          );
          this.config.data.datasets[1].data.push(data.totalAbsent);
        });
        this.lineChart.update();
        this.barChart.update();
      });
  }

  generateDonut() {
    let params = ``;
    if (this.user.role === "MENTOR") params = `mentorId=${this.user.id}`;
    else params = `year=${this.year}`;
    this.http
      .get(
        `${environment.apiUrl}/report/dashboard?${params}&date=${formatDate(
          this.date,
          "yyyy-MM-dd",
          "en"
        )}`
      )
      .subscribe((res: any) => {
        this.doughNut.data.datasets[0].data[0] = res[0].totalAbsent;
        this.doughNut.data.datasets[0].data[1] = res[0].totalPresent;
        this.doughNut.update();
      });
  }
}
