"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsAdmin = void 0;
const responses_1 = require("../utlis/responses");
const AdminController_1 = __importDefault(require("../http/controllers/AdminController"));
function checkIsAdmin(req, res, next) {
    const isAdmin = AdminController_1.default.isAdmin(req);
    if (!isAdmin) {
        return (0, responses_1.unauthorized)(res);
    }
    next();
}
exports.checkIsAdmin = checkIsAdmin;
