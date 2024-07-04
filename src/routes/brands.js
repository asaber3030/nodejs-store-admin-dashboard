"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const BrandsController_1 = __importDefault(require("../http/controllers/BrandsController"));
const checkIsAdmin_1 = require("../middlewares/checkIsAdmin");
const brandsRouter = express_1.default.Router();
brandsRouter.use(checkIsAdmin_1.checkIsAdmin);
brandsRouter.get('/brands', BrandsController_1.default.get);
brandsRouter.post('/brands/create', BrandsController_1.default.createBrand);
brandsRouter.get('/brands/:id', BrandsController_1.default.getBrand);
brandsRouter.get('/brands/:id/products', BrandsController_1.default.getBrandProducts);
brandsRouter.patch('/brands/:id/update', BrandsController_1.default.updateBrand);
brandsRouter.delete('/brands/:id/delete', BrandsController_1.default.deleteBrand);
exports.default = brandsRouter;
