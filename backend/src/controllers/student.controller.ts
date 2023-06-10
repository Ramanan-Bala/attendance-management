import { User } from "./../models/user";
import { Request, Response } from "express";
import { StudentService, HourlyAttendanceService } from "../services";
import {
  Section,
  Student,
  HourlyAttendance,
  DayAttendance,
  Subject,
  Year,
} from "../models";
import { Op, Sequelize } from "sequelize";
import { getPagingData } from "../helpers";

export class StudentController {
  private studentService: StudentService;

  private options = {
    attributes: [
      "id",
      "name",
      "rollNo",
      "regNo",
      "sectionId",
      "studentMobile",
      "parentMobile",
      [Sequelize.col("section.name"), "sectionName"],
      "yearId",
      [Sequelize.col("year.name"), "yearName"],
      "mentorId",
      [Sequelize.col("mentor.name"), "mentorName"],
    ],
    include: [
      {
        model: Section,
        as: "section",
        attributes: [],
      },
      {
        model: Year,
        as: "year",
        attributes: [],
      },
      { model: User, as: "mentor", attributes: [] },
    ],
    order: [
      ["yearId", "ASC"],
      ["sectionId", "ASC"],
      ["rollNo", "ASC"],
    ],
  };

  private hourlyOptions = {
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

  private dayOptions = {
    attributes: [
      "id",
      "date",
      "studentId",
      "reason",
      [Sequelize.col("student.name"), "studentName"],
      [Sequelize.col("student.roll_no"), "studentRollNo"],
      [Sequelize.col("student.reg_no"), "studentRegNo"],
      [Sequelize.col("student.section_id"), "studentSectionId"],
      [Sequelize.col("student.section.name"), "sectionName"],
      [Sequelize.col("student.mentor_id"), "mentorId"],
      "isAbsent",
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
        order: [["rollNo", "ASC"]],
      },
    ],
  };

  constructor() {
    this.studentService = new StudentService(Student);
  }

  getPaged(req: Request, res: Response) {
    const { page, size, sec, mentor, search, fYear, fSec, fMentor }: any =
      req.query;
    let where = {};
    if (sec) where = { ...where, sectionId: sec };
    if (fYear) where = { ...where, yearId: fYear };
    if (fSec) where = { ...where, sectionId: fSec };
    if (fMentor) {
      if (fMentor.includes("null")) {
        if (typeof fMentor === "object") {
          fMentor.splice(fMentor.indexOf("null"), 1);
          where = {
            ...where,
            mentorId: {
              [Op.or]: [null, ...fMentor],
            },
          };
        } else where = { ...where, mentorId: { [Op.eq]: null } };
      } else where = { ...where, mentorId: fMentor };
    }
    if (mentor) {
      if (mentor != "null") where = { ...where, mentorId: mentor };
      else where = { ...where, mentorId: null };
    }
    if (search)
      where = {
        ...where,
        [Op.or]: [
          {
            name: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            rollNo: {
              [Op.like]: "%" + search + "%",
            },
          },
          {
            regNo: {
              [Op.like]: "%" + search + "%",
            },
          },
        ],
      };
    let fOptions: any = { ...this.options, where };
    this.studentService.getPaged(page, size, fOptions).then((students) => {
      res.status(200).json(getPagingData(students));
    });
  }

  getAll(req: Request, res: Response) {
    const { sec, mentor, year } = req.query;
    let where = {};
    if (sec) where = { ...where, sectionId: sec };
    if (year) where = { ...where, yearId: year };
    if (mentor) {
      if (mentor != "null") where = { ...where, mentorId: mentor };
      else where = { ...where, mentorId: null };
    }
    let fOptions: any = { ...this.options, where };
    this.studentService.getAll(fOptions).then((students) => {
      res.status(200).json(students);
    });
  }

  getById(req: Request, res: Response) {
    this.studentService.get(req.params.id, this.options).then((student) => {
      if (student) res.status(200).json(student);
      else
        res.status(404).json({
          message: `Student id:${req.params.id} does not exists`,
        });
    });
  }

  getHourlyPresent(req: Request, res: Response) {
    const { hour, mentor, date } = req.query;
    let preStudents: Student[];
    Student.findAll({ where: { mentorId: mentor } }).then((students) => {
      preStudents = students;
      let options: any = this.hourlyOptions;
      if (hour && date)
        options = {
          ...options,
          where: {
            hour,
            date: new Date(String(date)),
          },
        };
      HourlyAttendance.findAll(options).then((absStudent) => {
        absStudent.forEach((abs) => {
          preStudents = preStudents.filter(
            (pre) => pre.dataValues.id != abs.dataValues.studentId
          );
        });

        res.status(200).json(preStudents);
      });
    });
  }

  getDayPresent(req: Request, res: Response) {
    const { mentor, date, year, sec }: any = req.query;
    let preStudents: Student[];
    User.findByPk(mentor).then((user) => {
      let where = {};
      if (sec) where = { ...where, sectionId: sec };
      if (year) where = { ...where, yearId: year };
      if (user?.dataValues.role != "ADMIN")
        where = { ...where, mentorId: mentor };
      Student.findAll({ where,order:[["rollNo","ASC"]] }).then((students) => {
        preStudents = students;
        let options: any = this.dayOptions;
        if (date)
          options = {
            ...options,
            where: {
              date: new Date(String(date)),
            },
          };
        DayAttendance.findAll(options).then((absStudents) => {
          absStudents.forEach((abs) => {
            preStudents = preStudents.filter(
              (pre) => pre.dataValues.id != abs.dataValues.studentId
            );
          });
          if (user?.dataValues.role != "ADMIN")
            absStudents = absStudents.filter(
              (abs) => abs.dataValues.mentorId === parseInt(mentor)
            );
          res.status(200).json({ preStudents, absStudents });
        });
      });
    });
  }

  post(req: Request, res: Response) {
    let data = req.body;

    if (data.length)
      Student.bulkCreate(data)
        .then((students) => res.status(201).json(students))
        .catch((err) => res.status(400).json(err));
    else {
      let student = new Student({ ...data });
      this.studentService
        .create(student)
        .then((student) => res.status(201).json(student))
        .catch((err) => res.status(400).json(err));
    }
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.studentService.get(req.params.id).then((student) => {
      if (student) {
        let updatedStudent = new Student({
          ...student.dataValues,
          ...data,
        });

        this.studentService
          .update(req.params.id, updatedStudent)
          .then(() => res.status(200).json(updatedStudent))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Student id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.studentService.get(req.params.id).then((student) => {
      if (student) {
        this.studentService
          .delete(req.params.id)
          .then((student) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Student id:${req.params.id} does not exists` });
    });
  }
}
