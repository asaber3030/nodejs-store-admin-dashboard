"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const usersRouter = express_1.default.Router();
usersRouter.get('/users', (req, res, next) => {
    return res.send('Hello users');
});
usersRouter.get('/users/get', (req, res, next) => {
    return res.send('get users');
});
exports.default = usersRouter;
