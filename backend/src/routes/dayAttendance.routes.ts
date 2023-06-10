import { Router } from "express";
import { DayAttendanceController } from "../controllers";

export class DayAttendanceRoutes {
  private router: Router;
  private controller: DayAttendanceController;

  constructor() {
    this.controller = new DayAttendanceController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    //! GetPaged
    this.router.get("/page", (req, res) => this.controller.getPaged(req, res));

    //! GetAll
    this.router.get("/", (req, res) => this.controller.getAll(req, res));

    //! GetById
    this.router.get("/:id", (req, res) => this.controller.getById(req, res));

    //! Post
    this.router.post("/", (req, res) => this.controller.post(req, res));

    //! Put
    this.router.put("/:id", (req, res) => this.controller.update(req, res));

    //! Delete
    this.router.delete("/:id", (req, res) => this.controller.delete(req, res));

    //! BulkDelete
    this.router.delete("/", (req, res) => this.controller.bulkDelete(req, res));
  }

  public getRouter() {
    return this.router;
  }
}
