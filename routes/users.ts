import express from "express"

import UserController from "../http/controllers/UserController"

const usersRouter = express.Router()

usersRouter.get('/users', UserController.get)
usersRouter.post('/users/login', UserController.login)
usersRouter.post('/users/register', UserController.register)
usersRouter.get('/users/:userId/addresses', UserController.addresses)
usersRouter.get('/users/:userId/orders', UserController.orders)
usersRouter.get('/users/:userId/orders/:orderId', UserController.getOrder)
usersRouter.get('/users/:userId', UserController.user)
usersRouter.patch('/users/:userId/update', UserController.update)
usersRouter.delete('/users/:userId/delete', UserController.delete)

export default usersRouter