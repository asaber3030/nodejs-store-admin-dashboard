import express from "express"

import UserController from "../http/controllers/UserController"

const usersAuthRouter = express.Router()

usersAuthRouter.post('/users/login', UserController.login)
usersAuthRouter.post('/users/register', UserController.register)

export default usersAuthRouter