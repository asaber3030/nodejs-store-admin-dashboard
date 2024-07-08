import { NextFunction, Request, Response } from "express";
import { AppStatus } from "../types";

export function checkAppStatus(req: Request, res: Response, next: NextFunction) {
  if (process.env.APP_STATUS) {
    const appStatus = process.env.APP_STATUS as AppStatus
    switch (appStatus) {
      case 'running':
        next()
      case 'maintanence':
        res.status(404).json({
          message: 'App running in maintanence mode.'
        })

      default:
        next()
    }
  }
  next()
}