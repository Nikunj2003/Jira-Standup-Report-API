import { type Request, type Response } from "express";
import { StatusCodes } from "http-status-codes";

export class ApiInfoController {
  private apiName: string;
  private apiVersion: string;

  constructor(apiName = "Jira Report API", apiVersion = "1.0.0") {
    this.apiName = apiName;
    this.apiVersion = apiVersion;
    this.getApiInfo = this.getApiInfo.bind(this);
  }

  public getApiInfo(_req: Request, res: Response): Response {
    const apiInfo = {
      Name: this.apiName,
      Version: this.apiVersion,
    };

    return res.status(StatusCodes.OK).json(apiInfo);
  }
}
