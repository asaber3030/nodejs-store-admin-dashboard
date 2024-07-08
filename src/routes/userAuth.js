"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../http/controllers/UserController"));
const usersAuthRouter = express_1.default.Router();
usersAuthRouter.post('/users/login', UserController_1.default.login);
usersAuthRouter.post('/users/register', UserController_1.default.register);
exports.default = usersAuthRouter;
