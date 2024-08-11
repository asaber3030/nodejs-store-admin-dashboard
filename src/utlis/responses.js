"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unauthorized = unauthorized;
exports.notFound = notFound;
exports.badRequest = badRequest;
function unauthorized(res, message = "Unauthorized.") {
    return res.status(401).json({
        message,
        status: 401
    });
}
function notFound(res, message = "Error 404 - Not Found.") {
    return res.status(404).json({
        message,
        status: 404
    });
}
function badRequest(res, message = "Something went wrong.") {
    return res.status(500).json({
        message,
        status: 500
    });
}
