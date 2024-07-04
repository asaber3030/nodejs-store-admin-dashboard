"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = __importDefault(require("../http/controllers/AdminController"));
const authRouter = express_1.default.Router();
authRouter.post('/login', AdminController_1.default.login);
authRouter.get('/is-authorized', AdminController_1.default.authorize);
authRouter.get('/admin', AdminController_1.default.admin);
exports.default = authRouter;
