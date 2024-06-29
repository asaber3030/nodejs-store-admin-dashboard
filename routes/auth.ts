import express from "express"
import db from "../utlis/db"

import AdminController from "../http/controllers/AdminController"

const authRouter = express.Router()

authRouter.post('/login', AdminController.login)
authRouter.get('/is-authorized', AdminController.authorize)
authRouter.get('/admin', AdminController.admin)

export default authRouter