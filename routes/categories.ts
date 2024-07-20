import express from "express"

import CategoriesController from "../http/controllers/CategoriesController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const categoriesRouter = express.Router()

categoriesRouter.use(checkIsAdmin)

categoriesRouter.get('/categories', CategoriesController.get)
categoriesRouter.get('/categories/counts', CategoriesController.countStats)
categoriesRouter.post('/categories/create', CategoriesController.createCategory)
categoriesRouter.get('/categories/:id', CategoriesController.getCategory)
categoriesRouter.get('/categories/:id/products', CategoriesController.getCategoryProducts)
categoriesRouter.patch('/categories/:id/update', CategoriesController.updateCategory)
categoriesRouter.delete('/categories/:id/delete', CategoriesController.deleteCategory)

export default categoriesRouter