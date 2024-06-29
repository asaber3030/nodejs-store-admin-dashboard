import express from "express"

import ProductsController from "../http/controllers/ProductsController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const productsRouter = express.Router()

productsRouter.use(checkIsAdmin)

productsRouter.get('/products', ProductsController.get)
productsRouter.post('/products/create', ProductsController.createProduct)
productsRouter.get('/products/:id', ProductsController.getProduct)
productsRouter.get('/products/:id/brand', ProductsController.getProductBrand)
productsRouter.get('/products/:id/pictures', ProductsController.getProductPictures)
productsRouter.post('/products/:id/pictures/add', ProductsController.createProductPicture)
productsRouter.patch('/products/:id/pictures/update/:pictureId', ProductsController.updateProductPicture)
productsRouter.delete('/products/:id/pictures/delete/:pictureId', ProductsController.deleteProductPicture)
productsRouter.get('/products/:id/category', ProductsController.getProductCategory)
productsRouter.patch('/products/:id/update', ProductsController.updateProduct)
productsRouter.delete('/products/:id/delete', ProductsController.deleteProduct)

export default productsRouter