import express from "express"
import AdminController from "../http/controllers/AdminController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const adminDataRouter = express.Router()

adminDataRouter.use(checkIsAdmin)

adminDataRouter.get('/admins', AdminController.get)
adminDataRouter.get('/admins/counts', AdminController.countStats)
adminDataRouter.patch('/admins/:adminId/update', AdminController.update)
adminDataRouter.delete('/admins/:adminId/delete', AdminController.delete)

export default adminDataRouter