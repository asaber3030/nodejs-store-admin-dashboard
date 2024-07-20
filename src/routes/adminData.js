"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminController_1 = __importDefault(require("../http/controllers/AdminController"));
const checkIsAdmin_1 = require("../middlewares/checkIsAdmin");
const adminDataRouter = express_1.default.Router();
adminDataRouter.use(checkIsAdmin_1.checkIsAdmin);
adminDataRouter.get('/admins', AdminController_1.default.get);
adminDataRouter.get('/admins/counts', AdminController_1.default.countStats);
adminDataRouter.patch('/admins/:adminId/update', AdminController_1.default.update);
adminDataRouter.delete('/admins/:adminId/delete', AdminController_1.default.delete);
exports.default = adminDataRouter;
