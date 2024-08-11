"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAppStatus = checkAppStatus;
function checkAppStatus(req, res, next) {
    if (process.env.APP_STATUS) {
        const appStatus = process.env.APP_STATUS;
        switch (appStatus) {
            case 'running':
                next();
            case 'maintanence':
                res.status(404).json({
                    message: 'App running in maintanence mode.'
                });
            default:
                next();
        }
    }
    next();
}
