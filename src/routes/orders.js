"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OrdersController_1 = __importDefault(require("../http/controllers/OrdersController"));
const checkIsAdmin_1 = require("../middlewares/checkIsAdmin");
const ordersRouter = express_1.default.Router();
ordersRouter.use(checkIsAdmin_1.checkIsAdmin);
ordersRouter.get('/orders', OrdersController_1.default.get);
ordersRouter.post('/orders/create', OrdersController_1.default.createOrder);
ordersRouter.get('/orders/:id', OrdersController_1.default.getOrder);
ordersRouter.get('/orders/:id/items', OrdersController_1.default.getOrderItems);
ordersRouter.get('/orders/:id/owner', OrdersController_1.default.getOrderOwner);
ordersRouter.patch('/orders/:id/update', OrdersController_1.default.updateOrder);
ordersRouter.delete('/orders/:id/delete', OrdersController_1.default.deleteOrder);
exports.default = ordersRouter;
