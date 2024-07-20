"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CouponsController_1 = __importDefault(require("../http/controllers/CouponsController"));
const checkIsAdmin_1 = require("../middlewares/checkIsAdmin");
const couponsRouter = express_1.default.Router();
couponsRouter.use(checkIsAdmin_1.checkIsAdmin);
couponsRouter.get('/coupons', CouponsController_1.default.get);
couponsRouter.get('/coupons/counts', CouponsController_1.default.countStats);
couponsRouter.post('/coupons/create', CouponsController_1.default.createCoupon);
couponsRouter.get('/coupons/:id', CouponsController_1.default.getCoupon);
couponsRouter.patch('/coupons/:id/update', CouponsController_1.default.updateCoupon);
couponsRouter.delete('/coupons/:id/delete', CouponsController_1.default.deleteCoupon);
exports.default = couponsRouter;
