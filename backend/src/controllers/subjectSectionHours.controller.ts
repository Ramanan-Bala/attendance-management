import { Request, Response } from "express";
import { SubjectSectionHoursService } from "../services";
import { SubjectSectionHours, Section, Subject } from "../models";
import { getPagingData } from "../helpers";
import { Sequelize } from "sequelize";

export class SubjectSectionHoursController {
  private subjectSectionHoursService: SubjectSectionHoursService;

  private options = {
    attributes: [
      "id",
      "totalHours",
      "sectionId",
      [Sequelize.col("section.name"), "sectionName"],
      "subjectId",
      [Sequelize.col("subject.name"), "subjectName"],
      [Sequelize.col("subject.code"), "subjectCode"],
    ],
    include: [
      {
        model: Subject,
        as: "subject",
        attributes: [],
      },
      {
        model: Section,
        as: "section",
        attributes: [],
      },
    ],
  };

  constructor() {
    this.subjectSectionHoursService = new SubjectSectionHoursService(
      SubjectSectionHours
    );
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.subjectSectionHoursService
      .getPaged(page, size, this.options)
      .then((subjectSectionHours) => {
        res.status(200).json(getPagingData(subjectSectionHours));
      });
  }

  getAll(req: Request, res: Response) {
    this.subjectSectionHoursService
      .getAll(this.options)
      .then((subjectSectionHours) => {
        res.status(200).json(subjectSectionHours);
      });
  }

  getById(req: Request, res: Response) {
    this.subjectSectionHoursService
      .get(req.params.id, this.options)
      .then((subjectSectionHours) => {
        if (subjectSectionHours) res.status(200).json(subjectSectionHours);
        else
          res.status(404).json({
            message: `Subject Section Hours Attendance id:${req.params.id} does not exists`,
          });
      });
  }

  post(req: Request, res: Response) {
    let data = req.body;

    let subjectSectionHours = new SubjectSectionHours(data);
    this.subjectSectionHoursService
      .create(subjectSectionHours)
      .then((subjectSectionHours) => res.status(201).json(subjectSectionHours))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let data = req.body;

    this.subjectSectionHoursService
      .get(req.params.id)
      .then((subjectSectionHours) => {
        if (subjectSectionHours) {
          let updatedSubjectSectionHours = new SubjectSectionHours({
            ...subjectSectionHours.dataValues,
            ...data,
          });

          this.subjectSectionHoursService
            .update(req.params.id, updatedSubjectSectionHours)
            .then(() => res.status(200).json(updatedSubjectSectionHours))
            .catch((err) => res.status(400).json(err));
        } else
          res.status(404).json({
            message: `Subject Section Hours Attendance id:${req.params.id} does not exists`,
          });
      });
  }

  delete(req: Request, res: Response) {
    this.subjectSectionHoursService
      .get(req.params.id)
      .then((subjectSectionHours) => {
        if (subjectSectionHours) {
          this.subjectSectionHoursService
            .delete(req.params.id)
            .then((subjectSectionHours) => res.status(200).json())
            .catch((err) => res.status(400).json(err));
        } else
          res.status(404).json({
            message: `Subject Section Hours id:${req.params.id} does not exists`,
          });
      });
  }
}
