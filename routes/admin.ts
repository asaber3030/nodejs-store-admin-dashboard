import express from "express"

import AdminController from "../http/controllers/AdminController"

const adminRouter = express.Router()

adminRouter.post('/admins/login', AdminController.login)
adminRouter.post('/admins/register', AdminController.register)
adminRouter.get('/admins/is-authorized', AdminController.authorize)
adminRouter.get('/admins/get-current', AdminController.admin)

export default adminRouter