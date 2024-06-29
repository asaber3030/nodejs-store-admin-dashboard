import express from "express"

import OrdersController from "../http/controllers/OrdersController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const ordersRouter = express.Router()

ordersRouter.use(checkIsAdmin)

ordersRouter.get('/orders', OrdersController.get)
ordersRouter.post('/orders/create', OrdersController.createOrder)
ordersRouter.get('/orders/:id', OrdersController.getOrder)
ordersRouter.get('/orders/:id/items', OrdersController.getOrderItems)
ordersRouter.get('/orders/:id/owner', OrdersController.getOrderOwner)
ordersRouter.patch('/orders/:id/update', OrdersController.updateOrder)
ordersRouter.delete('/orders/:id/delete', OrdersController.deleteOrder)

export default ordersRouter