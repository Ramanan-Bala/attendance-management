import { Router } from "express";
import { ReportController } from "../controllers";

export class ReportRoutes {
  private router: Router;
  private controller: ReportController;

  constructor() {
    this.controller = new ReportController();
    this.router = Router();
    this.routes();
  }

  private routes() {
    //! GetDayReport
    this.router.get("/day", (req, res) =>
      this.controller.getDayReport(req, res)
    );

    //! DashboardReportByDate
    this.router.get("/dashboard", (req, res) =>
      this.controller.getDashboardReportByDate(req, res)
    );

    //! DashboardReportByDateRange
    this.router.get("/dashboard/range", (req, res) =>
      this.controller.getDashboardReportByDateRange(req, res)
    );
  }

  public getRouter() {
    return this.router;
  }
}
