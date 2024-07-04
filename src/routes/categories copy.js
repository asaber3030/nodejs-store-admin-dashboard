"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CategoriesController_1 = __importDefault(require("../http/controllers/CategoriesController"));
const checkIsAdmin_1 = require("../middlewares/checkIsAdmin");
const categoriesRouter = express_1.default.Router();
categoriesRouter.use(checkIsAdmin_1.checkIsAdmin);
categoriesRouter.get('/categories', CategoriesController_1.default.get);
categoriesRouter.post('/categories/create', CategoriesController_1.default.createCategory);
categoriesRouter.get('/categories/:id', CategoriesController_1.default.getCategory);
categoriesRouter.get('/categories/:id/products', CategoriesController_1.default.getCategoryProducts);
categoriesRouter.patch('/categories/:id/update', CategoriesController_1.default.updateCategory);
categoriesRouter.delete('/categories/:id/delete', CategoriesController_1.default.deleteCategory);
exports.default = categoriesRouter;
