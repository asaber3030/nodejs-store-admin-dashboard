"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../http/controllers/UserController"));
const usersRouter = express_1.default.Router();
usersRouter.get('/users', UserController_1.default.get);
usersRouter.post('/users/login', UserController_1.default.login);
usersRouter.post('/users/register', UserController_1.default.register);
usersRouter.get('/users/:userId/addresses', UserController_1.default.addresses);
usersRouter.get('/users/:userId/orders', UserController_1.default.orders);
usersRouter.get('/users/:userId/orders/:orderId', UserController_1.default.getOrder);
usersRouter.get('/users/:userId', UserController_1.default.user);
usersRouter.patch('/users/:userId/update', UserController_1.default.update);
usersRouter.delete('/users/:userId/delete', UserController_1.default.delete);
exports.default = usersRouter;
