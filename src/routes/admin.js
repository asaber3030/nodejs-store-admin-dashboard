"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = __importDefault(require("../http/controllers/AdminController"));
const adminRouter = express_1.default.Router();
adminRouter.post('/admins/login', AdminController_1.default.login);
adminRouter.post('/admins/register', AdminController_1.default.register);
adminRouter.get('/admins/is-authorized', AdminController_1.default.authorize);
adminRouter.get('/admins/get-current', AdminController_1.default.admin);
exports.default = adminRouter;
