import express from "express"

import CouponsController from "../http/controllers/CouponsController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const couponsRouter = express.Router()

couponsRouter.use(checkIsAdmin)

couponsRouter.get('/coupons', CouponsController.get)
couponsRouter.get('/coupons/counts', CouponsController.countStats)
couponsRouter.post('/coupons/create', CouponsController.createCoupon)
couponsRouter.get('/coupons/:id', CouponsController.getCoupon)
couponsRouter.patch('/coupons/:id/update', CouponsController.updateCoupon)
couponsRouter.delete('/coupons/:id/delete', CouponsController.deleteCoupon)

export default couponsRouter