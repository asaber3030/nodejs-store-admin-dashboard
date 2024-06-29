import express from "express"

import BrandsController from "../http/controllers/BrandsController"

import { checkIsAdmin } from "../middlewares/checkIsAdmin"

const brandsRouter = express.Router()

brandsRouter.use(checkIsAdmin)

brandsRouter.get('/brands', BrandsController.get)
brandsRouter.post('/brands/create', BrandsController.createBrand)
brandsRouter.get('/brands/:id', BrandsController.getBrand)
brandsRouter.get('/brands/:id/products', BrandsController.getBrandProducts)
brandsRouter.patch('/brands/:id/update', BrandsController.updateBrand)
brandsRouter.delete('/brands/:id/delete', BrandsController.deleteBrand)

export default brandsRouter