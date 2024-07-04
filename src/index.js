"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helpers_1 = require("./utlis/helpers");
const routes_1 = require("./routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.APP_PORT;
app.use(express_1.default.json());
app.use('/api/v1', [
    routes_1.adminRouter,
    routes_1.adminDataRouter,
    routes_1.productsRouter,
    routes_1.usersRouter,
    routes_1.ordersRouter,
    routes_1.brandsRouter,
    routes_1.couponsRouter,
    routes_1.categoriesRouter,
]);
app.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        message: "Welcome to admin store admin dashboard",
        info: "To start using the api head to this route: /api/v1/login",
        status: 200,
    });
}));
app.get('new-route', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json({
        message: "New route",
    });
}));
app.listen(port, () => {
    (0, helpers_1.showAppURLCMD)(port);
});
exports.default = app;
