import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

export class HealthController {

  constructor() {
    this.checkHealth = this.checkHealth.bind(this);
  }

  public async checkHealth(
    _req: Request<object, object, object, object>,
    res: Response
  ): Promise<Response> {
    return res.status(StatusCodes.OK).json({ status: "OK", timestamp: new Date() });
  }
}
