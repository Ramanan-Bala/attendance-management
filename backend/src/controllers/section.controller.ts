import { Request, Response } from "express";
import { SectionService } from "../services";
import { Section } from "../models";
import { getPagingData } from "../helpers";

export class SectionController {
  private sectionService: SectionService;

  constructor() {
    this.sectionService = new SectionService(Section);
  }

  getPaged(req: Request, res: Response) {
    const { page, size } = req.query;
    this.sectionService
      .getPaged(page, size)
      .then((sections) => res.status(200).json(getPagingData(sections)));
  }

  getAll(req: Request, res: Response) {
    this.sectionService
      .getAll()
      .then((sections) => res.status(200).json(sections));
  }

  getById(req: Request, res: Response) {
    this.sectionService.get(req.params.id).then((section) => {
      if (section) res.status(200).json(section);
      else
        res
          .status(404)
          .json({ message: `Section id:${req.params.id} does not exists` });
    });
  }

  post(req: Request, res: Response) {
    let { name } = req.body;
    let section = new Section({ name });
    this.sectionService
      .create(section)
      .then((section) => res.status(201).json(section))
      .catch((err) => res.status(400).json(err));
  }

  update(req: Request, res: Response) {
    let { id, name } = req.body;

    this.sectionService.get(req.params.id).then((section) => {
      if (section) {
        let updatedSection = new Section({ ...section.dataValues, name });

        this.sectionService
          .update(id, updatedSection)
          .then(() => res.status(200).json(updatedSection))
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Section id:${req.params.id} does not exists` });
    });
  }

  delete(req: Request, res: Response) {
    this.sectionService.get(req.params.id).then((section) => {
      if (section) {
        this.sectionService
          .delete(req.params.id)
          .then((section) => res.status(200).json())
          .catch((err) => res.status(400).json(err));
      } else
        res
          .status(404)
          .json({ message: `Section id:${req.params.id} does not exists` });
    });
  }
}
