"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Controller {
    constructor(secret) {
        this.secret = process.env.APP_SECRET;
    }
}
exports.default = Controller;
