import { Request, Response } from "express";
import { SubjectService } from "../services";
import { Subject } from "../models";
import { getPagingData } from "../helpers";

export class SubjectController {
  private subjectService: SubjectService;

  constructor() {
    this.subjectService = new SubjectService(Subject);
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.subjectService
      .getPaged(page, size)
      .then((subjects) => res.status(200).json(getPagingData(subjects)));
  }

  getAll(req: Request, res: Response) {
    this.subjectService
      .getAll()
      .then((subjects) => res.status(200).json(subjects));
  }

  getById(req: Request, res: Response) {
    this.subjectService.get(req.params.id).then((subject) => {
      if (subject) res.status(200).json(subject);
      else
        res
          .status(404)
          .json({ message: `Subject id:${req.params.id} does not exists` });
    });
  }

  post(req: Request, res: Response) {
    let { name, code } = req.body;
    let section = new Subject({ name, code });
    this.subjectService
      .create(section)
      .then((section) => res.status(201).json(section))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let { id, name, code } = req.body;

    this.subjectService.get(req.params.id).then((subject) => {
      if (subject) {
        let updatedSubject = new Subject({ ...subject.dataValues, name, code });
        this.subjectService
          .update(id, updatedSubject)
          .then(() => res.status(200).json(updatedSubject))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Subject id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.subjectService.get(req.params.id).then((subject) => {
      if (subject) {
        this.subjectService
          .delete(req.params.id)
          .then((section) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Subject id:${req.params.id} does not exists` });
    });
  }
}
