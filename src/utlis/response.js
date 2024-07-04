"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.response = response;
function response(message, status, data) {
    const res = new Response();
    return res.status(status).json({
        message,
        data
    });
}
