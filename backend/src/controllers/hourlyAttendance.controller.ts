import { Request, Response } from "express";
import { HourlyAttendanceService } from "../services";
import { HourlyAttendance, Section, Student, Subject } from "../models";
import { getPagingData } from "../helpers";
import { Optional, Sequelize } from "sequelize";

export class HourlyAttendanceController {
  private hourlyAttendanceService: HourlyAttendanceService;

  private options = {
    attributes: [
      "id",
      "date",
      "hour",
      "isAbsent",
      [Sequelize.col("subject.id"), "subjectId"],
      [Sequelize.col("subject.name"), "subjectName"],
      [Sequelize.col("subject.code"), "subjectCode"],
      "studentId",
      [Sequelize.col("student.name"), "studentName"],
      [Sequelize.col("student.roll_no"), "studentRollNo"],
      [Sequelize.col("student.reg_no"), "studentRegNo"],
      [Sequelize.col("student.section_id"), "studentSectionId"],
      [Sequelize.col("student.section.name"), "sectionName"],
    ],
    include: [
      {
        model: Student,
        as: "student",
        attributes: [],
        include: [
          {
            model: Section,
            as: "section",
          },
        ],
      },
      { model: Subject, as: "subject", attributes: [] },
    ],
  };

  constructor() {
    this.hourlyAttendanceService = new HourlyAttendanceService(
      HourlyAttendance
    );
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.hourlyAttendanceService
      .getPaged(page, size, this.options)
      .then((hourlyAttendances) => {
        res.status(200).json(getPagingData(hourlyAttendances));
      });
  }

  getAll(req: Request, res: Response) {
    this.hourlyAttendanceService
      .getAll(this.options)
      .then((hourlyAttendances) => {
        res.status(200).json(hourlyAttendances);
      });
  }

  getById(req: Request, res: Response) {
    this.hourlyAttendanceService
      .get(req.params.id, this.options)
      .then((hourlyAttendance) => {
        if (hourlyAttendance) res.status(200).json(hourlyAttendance);
        else
          res.status(404).json({
            message: `Hourly Attendance id:${req.params.id} does not exists`,
          });
      });
  }

  post(req: Request, res: Response) {
    let data = req.body;

    let students = data.studentId;
    delete data.studentId;

    let absentees: any[] = [];
    students?.forEach((s: any) => {
      absentees.push({ ...data, studentId: s });
    });

    if (absentees.length === 0)
      return res.status(400).json({ errorMessage: "Students required" });

    HourlyAttendance.bulkCreate(absentees)
      .then((hourlyAttendance) => res.status(201).json(hourlyAttendance))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.hourlyAttendanceService.get(req.params.id).then((hourlyAttendance) => {
      if (hourlyAttendance) {
        let updatedHourlyAttendance = new HourlyAttendance({
          ...hourlyAttendance.dataValues,
          ...data,
        });

        this.hourlyAttendanceService
          .update(req.params.id, updatedHourlyAttendance)
          .then(() => res.status(200).json(updatedHourlyAttendance))
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Hourly Attendance id:${req.params.id} does not exists`,
        });
    });
  }

  delete(req: Request, res: Response) {
    this.hourlyAttendanceService.get(req.params.id).then((hourlyAttendance) => {
      if (hourlyAttendance) {
        this.hourlyAttendanceService
          .delete(req.params.id)
          .then((hourlyAttendance) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Hourly Attendance id:${req.params.id} does not exists`,
        });
    });
  }
}
