import { Request, Response } from "express";
import { TimeTableService } from "../services";
import { Section, Subject, TimeTable, Year } from "../models";
import { Sequelize } from "sequelize";
import { getPagingData } from "../helpers";

export class TimeTableController {
  private timeTableService: TimeTableService;

  private options = {
    attributes: [
      "id",
      "day",
      "sectionId",
      [Sequelize.col("section.name"), "sectionName"],
      "yearId",
      [Sequelize.col("year.name"), "yearName"],
      "period1SubjectId",
      [Sequelize.col("period1Subject.name"), "period1SubjectName"],
      "period2SubjectId",
      [Sequelize.col("period2Subject.name"), "period2SubjectName"],
      "period3SubjectId",
      [Sequelize.col("period3Subject.name"), "period3SubjectName"],
      "period4SubjectId",
      [Sequelize.col("period4Subject.name"), "period4SubjectName"],
      "period5SubjectId",
      [Sequelize.col("period5Subject.name"), "period5SubjectName"],
      "period6SubjectId",
      [Sequelize.col("period6Subject.name"), "period6SubjectName"],
      "period7SubjectId",
      [Sequelize.col("period7Subject.name"), "period7SubjectName"],
      "period8SubjectId",
      [Sequelize.col("period8Subject.name"), "period8SubjectName"],
    ],
    include: [
      { model: Year, as: "year", attributes: [] },
      { model: Section, as: "section", attributes: [] },
      { model: Subject, as: "period1Subject", attributes: [] },
      { model: Subject, as: "period2Subject", attributes: [] },
      { model: Subject, as: "period3Subject", attributes: [] },
      { model: Subject, as: "period4Subject", attributes: [] },
      { model: Subject, as: "period5Subject", attributes: [] },
      { model: Subject, as: "period6Subject", attributes: [] },
      { model: Subject, as: "period7Subject", attributes: [] },
      { model: Subject, as: "period8Subject", attributes: [] },
    ],
  };
  constructor() {
    this.timeTableService = new TimeTableService(TimeTable);
  }

  getPaged(req: Request, res: Response) {
    const { page, size, sec } = req.query;
    let fOptions: any = { ...this.options };
    if (sec) fOptions = { ...fOptions, where: { sectionId: sec } };
    this.timeTableService.getPaged(page, size, fOptions).then((timeTables) => {
      res.status(200).json(getPagingData(timeTables));
    });
  }

  getAll(req: Request, res: Response) {
    const { sec } = req.query;
    let fOptions: any = { ...this.options };
    if (sec) fOptions = { ...fOptions, where: { sectionId: sec } };
    this.timeTableService.getAll(fOptions).then((timeTables) => {
      res.status(200).json(timeTables);
    });
  }

  getById(req: Request, res: Response) {
    this.timeTableService.get(req.params.id, this.options).then((timeTable) => {
      if (timeTable) res.status(200).json(timeTable);
      else
        res.status(404).json({
          message: `Time Table id:${req.params.id} does not exists`,
        });
    });
  }

  post(req: Request, res: Response) {
    let data = req.body;

    let timeTable = new TimeTable(data);
    this.timeTableService
      .create(timeTable)
      .then((timeTable) => res.status(201).json(timeTable))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.timeTableService.get(req.params.id).then((timeTable) => {
      if (timeTable) {
        let updatedTimeTable = new TimeTable({
          ...timeTable.dataValues,
          ...data,
        });

        this.timeTableService
          .update(req.params.id, updatedTimeTable)
          .then(() => res.status(200).json(updatedTimeTable))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Time Table id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.timeTableService.get(req.params.id).then((timeTable) => {
      if (timeTable) {
        this.timeTableService
          .delete(req.params.id)
          .then((timeTable) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Time Table id:${req.params.id} does not exists` });
    });
  }
}
