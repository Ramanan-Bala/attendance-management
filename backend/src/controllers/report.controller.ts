import { Request, Response } from "express";
import { sequelize } from "../db";
import fs from "fs";
import { jsonToExcel } from "../helpers/jsonToCSV";

var nodemailer = require("nodemailer");
export class ReportController {
  constructor() {}

  getDayReport(req: Request, res: Response) {
    const { year, sec, date, isEmail }: any = req.query;
    let where = `WHERE da.is_absent = TRUE AND s.year_id = ${year}`;
    if (sec != "null") where += ` AND s.section_id = ${sec}`;
    sequelize
      .query(
        `
          SELECT  s.name, s.roll_no, s.reg_no, s.parent_mobile, COUNT(da.id) AS total_absent
          FROM students s 
          LEFT JOIN day_attendances da ON s.id = da.student_id 
          ${where} 
          GROUP BY s.id, s.name 
          HAVING SUM(${
            date
              ? `CASE WHEN da.date = "${date} 00:00:00.000 +00:00" THEN 1 ELSE 0 END`
              : "da.id"
          }) > 0;
        `
      )
      .then((data) => {
        const yearName = ["I", "II", "III", "IV"];
        const secName = ["A", "B", "C", "D", "E", "F"];

        let fDate = new Date(date);

        let fileName = `${
          date
            ? `${fDate.getDate()}-${fDate.getMonth()}-${fDate.getFullYear()} /`
            : ""
        } ${yearName[year - 1]} YEAR ${
          sec !== "null" ? secName[sec - 1] + " SEC" : ""
        }`;

        if (data[0].length !== 0) {
          if (!date) {
            jsonToExcel(data[0], year, sec, date).then((data) => {
              if (isEmail === "true")
                this.sendMail({
                  buffer: data,
                  fileName,
                });
              res.send(data);
            });
          } else
            sequelize
              .query(
                `
        SELECT da.reason, s.roll_no 
        FROM students s 
        LEFT JOIN day_attendances da ON s.id = da.student_id 
        ${where} ${
                  date ? `AND da.date = "${date} 00:00:00.000 +00:00"` : "da.id"
                }
        `
              )
              .then((reason) => {
                let absentees: any[] = [];
                data[0].forEach((abs: any) => {
                  reason[0].forEach((r: any) => {
                    if (abs.roll_no == r.roll_no)
                      absentees.push({ ...abs, reason: r.reason });
                  });
                });
                jsonToExcel(absentees, year, sec, date).then((data) => {
                  if (isEmail === "true")
                    this.sendMail({
                      buffer: data,
                      fileName,
                    });
                  res.send(data);
                });
              });
        } else res.send({ message: "No Absentees" });
      });
  }

  getDashboardReportByDate(req: Request, res: Response) {
    const { year, sec, date, mentorId }: any = req.query;

    let where = ``;
    if (year) where += ` s.year_id = ${year}`;
    if (sec)
      where += ` ${where.length === 0 ? "" : " AND"} s.section_id = ${sec}`;
    if (mentorId)
      where += ` ${where.length === 0 ? "" : " AND"} s.mentor_id = ${mentorId}`;

    sequelize
      .query(
        `
        SELECT COUNT(CASE WHEN da.date IS NULL THEN 1 END) as totalPresent,
        COUNT(CASE WHEN da.date IS NOT NULL THEN 1 END) as totalAbsent,
        COUNT(s.id) as totalStudents
        FROM students s
        LEFT JOIN day_attendances da ON s.id = da.student_id AND da.date = '${date} 00:00:00.000 +00:00'
        WHERE${where}
        `
      )
      .then((data) => {
        res.status(200).json(data[0]);
      });
  }

  getDashboardReportByDateRange(req: Request, res: Response) {
    const { year, sec, mentorId, startDate, endDate }: any = req.query;

    let where = ``;
    if (year) where += ` year_id = ${year}`;
    if (sec)
      where += ` ${where.length === 0 ? "" : " AND"} section_id = ${sec}`;
    if (mentorId)
      where += ` ${where.length === 0 ? "" : " AND"} mentor_id = ${mentorId}`;

    sequelize
      .query(
        `
        SELECT Date(date) AS date, COUNT(*) AS totalAbsent,
        (SELECT COUNT(*) FROM students WHERE${where}) AS totalStudent
        FROM day_attendances
        WHERE date BETWEEN "${startDate}" AND "${endDate}"
        AND student_id IN (SELECT id FROM students WHERE${where})
        AND is_absent = 1
        GROUP BY date
        `
      )
      .then((data) => {
        res.status(200).json(data[0]);
      });
  }

  sendMail(csv: any) {
    let mailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "panimalar.backup@gmail.com",
        pass: "tlktpezddakdlkfv",
      },
    });
    // to: "sathishjraman@gmail.com",
    let mailDetails = {
      from: "panimalar.backup@gmail.com",
      to: "gmail.com",
      subject: "Test mail",
      attachments: [
        {
          filename: csv.fileName,
          content: csv.buffer,
          contentType:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        },
      ],
    };

    mailTransporter.sendMail(mailDetails, function (err: any, data: any) {
      if (err) {
        console.log(err);
      } else {
        console.log("Email sent successfully");
      }
    });
  }
}
