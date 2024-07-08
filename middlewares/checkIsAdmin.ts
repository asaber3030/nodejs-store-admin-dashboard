import { NextFunction, Request, Response } from "express";
import { unauthorized } from "../utlis/responses";

import AdminController from "../http/controllers/AdminController";

export async function checkIsAdmin(req: Request, res: Response, next: NextFunction) {
  const isAdmin = await AdminController.isAdmin(req)
  if (!isAdmin) {
    return unauthorized(res)
  }
  next()
}