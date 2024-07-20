import express from "express"
import UserController from "../http/controllers/UserController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const usersRouter = express.Router()

usersRouter.use(checkIsAdmin)

usersRouter.get('/users', UserController.get)
usersRouter.get('/users/counts', UserController.countStats)
usersRouter.get('/users/:userId/addresses', UserController.addresses)
usersRouter.get('/users/:userId/orders', UserController.orders)
usersRouter.get('/users/:userId/orders/:orderId', UserController.getOrder)
usersRouter.get('/users/:userId', UserController.user)
usersRouter.patch('/users/:userId/update', UserController.update)
usersRouter.delete('/users/:userId/delete', UserController.delete)

export default usersRouter