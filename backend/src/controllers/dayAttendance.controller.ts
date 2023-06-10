import { Request, Response } from "express";
import { DayAttendanceService } from "../services";
import { DayAttendance, Student, Section } from "../models";
import { getPagingData } from "../helpers";
import { Sequelize } from "sequelize";

export class DayAttendanceController {
  private dayAttendanceService: DayAttendanceService;

  constructor() {
    this.dayAttendanceService = new DayAttendanceService(DayAttendance);
  }

  private options = {
    attributes: [
      "id",
      "date",
      "isAbsent",
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
    ],
  };

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.dayAttendanceService
      .getPaged(page, size, this.options)
      .then((dayAttendance) => {
        res.status(200).json(getPagingData(dayAttendance));
      });
  }

  getAll(req: Request, res: Response) {
    this.dayAttendanceService.getAll(this.options).then((dayAttendance) => {
      res.status(200).json(dayAttendance);
    });
  }

  getById(req: Request, res: Response) {
    this.dayAttendanceService
      .get(req.params.id, this.options)
      .then((dayAttendance) => {
        if (dayAttendance) res.status(200).json(dayAttendance);
        else
          res.status(404).json({
            message: `Day Attendance id:${req.params.id} does not exists`,
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

    DayAttendance.bulkCreate(absentees)
      .then(async (dayAttendance) => {
        res.status(201).json(dayAttendance);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.dayAttendanceService.get(req.params.id).then((dayAttendance) => {
      if (dayAttendance) {
        let updatedDayAttendance = new DayAttendance({
          ...dayAttendance.dataValues,
          ...data,
        });

        this.dayAttendanceService
          .update(req.params.id, updatedDayAttendance)
          .then(() => res.status(200).json(updatedDayAttendance))
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Day Attendance id:${req.params.id} does not exists`,
        });
    });
  }

  delete(req: Request, res: Response) {
    this.dayAttendanceService.get(req.params.id).then((dayAttendance) => {
      if (dayAttendance) {
        this.dayAttendanceService
          .delete(req.params.id)
          .then((dayAttendance) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res.status(404).json({
          message: `Day Attendance id:${req.params.id} does not exists`,
        });
    });
  }

  bulkDelete(req: Request, res: Response) {
    const { id }: any = req.query;

    DayAttendance.destroy({
      where: {
        id: id.split(","),
      },
    })
      .then((dayAttendance) => res.status(200).json())
      .catch((err) => res.status(400).json(err));
  }
}

