import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utlis/responses";

import AdminController from "../http/controllers/AdminController";

export function checkIsAdmin(req: Request, res: Response, next: NextFunction) {
  const isAdmin = AdminController.isAdmin(req)
  if (!isAdmin) {
    return unauthorized(res)
  }
  next()
}