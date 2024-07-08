import { Request, Response } from "express"
import { Prisma } from "@prisma/client"

import { createPagination, extractErrors } from "../../utlis/helpers"
import { badRequest, notFound } from "../../utlis/responses"
import { productPictureSchema, productSchemas } from "../../schema"

import db from "../../utlis/db"
import Product from "../models/Product"

export default class ProductsController {

  static async get(req: Request, res: Response) {

    const searchParam = req.query.search ? req.query.search : ''
    const { skip, limit, orderBy, orderType } = createPagination(req)

    try {
      const products = await Product.all(searchParam as string, skip, limit, orderBy, orderType)
      return res.status(200).json({
        status: 200,
        data: products
      })
    } catch (error) {
      return badRequest(res, "Invalid search parameters.")
    }
  }

  static async getProduct(req: Request, res: Response) {
    
    const productId = req.params.id ? +req.params.id : null
    
    if (!productId) return notFound(res)
    
    const product = await Product.find(productId)

    if (!product) {
      return notFound(res, `This product with id ${productId} wasn't found.`)
    }

    return res.status(200).json({
      data: product,
      status: 200
    })
  }

  static async getProductPictures(req: Request, res: Response) {
    
    const productId = req.params.id ? +req.params.id : null
    
    if (!productId) return notFound(res)
    
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, pictures: true }
    })

    if (!product) return notFound(res, "No product was found.")

    return res.status(200).json({
      data: product.pictures,
      status: 200
    })
  }

  static async getProductBrand(req: Request, res: Response) {
    
    const productId = req.params.id ? +req.params.id : null
    
    if (!productId) return notFound(res)
    
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, brandId: true }
    })

    if (!product) return notFound(res, "No product was found.")
  
    const brand = await db.brand.findUnique({ where: { id: product.brandId } })

    return res.status(200).json({
      data: brand,
      status: 200
    })
  }

  static async getProductCategory(req: Request, res: Response) {
    
    const productId = req.params.id ? +req.params.id : null
    
    if (!productId) return notFound(res)
    
    const product = await db.product.findUnique({
      where: { id: productId },
      select: { id: true, categoryId: true }
    })

    if (!product) return notFound(res, "No product was found.")
  
    const category = await db.category.findUnique({ where: { id: product.categoryId } })

    return res.status(200).json({
      data: category,
      status: 200
    })
  }
  
  static async updateProduct(req: Request, res: Response) {
    
    const productId = +req.params.id

    try {
      const product = await Product.find(productId)
      const body = req.body
      
      if (!product) return notFound(res, "This product doesn't exist.")

      const parsedBody = productSchemas.update.safeParse(body)
      const errors = extractErrors(parsedBody)
      
      if (!parsedBody.success) return res.status(402).json({ status: 401, errors })

      const updatedProduct = await Product.update(product.id, parsedBody.data)

      return res.status(200).json({
        data: updatedProduct, 
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Something went wrong. Check brandId, categoryId or productId")
    }
  }

  static async deleteProduct(req: Request, res: Response) {
    
    const productId = +req.params.id

    try {
      const product = await Product.find(productId)

      if (!product) return notFound(res, "This product doesn't exist.")

      const deleteProduct = await Product.delete(product.id)

      return res.status(200).json({
        data: deleteProduct,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Product ID.")
    }
  }

  static async createProduct(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedBody = productSchemas.create.safeParse(body)
      const errors = extractErrors(parsedBody)
      const data = parsedBody.data
      
      if (!parsedBody.success) return res.status(402).json({ status: 401, errors })
      if (!data) return badRequest(res)

      const brand = await db.brand.findUnique({ where: { id: data.brandId } })
      const category = await db.category.findUnique({ where: { id: data.categoryId } })

      if (!brand) return notFound(res, "Brand with provided id doesn't exist")
      if (!category) return notFound(res, "Category with provided id doesn't exist")

      const createdProduct = await Product.create(data as unknown as Prisma.ProductCreateInput)

      return res.status(201).json({
        data: createdProduct,
        status: 201
      })

    } catch (error) {
      return badRequest(res, error as any)
    }
  }

  static async createProductPicture(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedBody = productPictureSchema.create.safeParse(body)
      const errors = extractErrors(parsedBody)
      const data = parsedBody.data
      const productId = +req.params.id
      
      if (!parsedBody.success) return res.status(402).json({ status: 401, errors })
      if (!data || !productId) return badRequest(res)

      const product = await Product.find(productId)

      if (!product) return notFound(res, "This product doesn't exist.")

      const createdPicture = await db.productPicture.create({
        data: {
          productId: product.id,
          url: data.url
        }
      })

      return res.status(201).json({
        data: createdPicture,
        message: "Product picture hass been added",
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

  static async updateProductPicture(req: Request, res: Response) {
    
    try {
      const parsedBody = productPictureSchema.create.safeParse(req.body)
      const errors = extractErrors(parsedBody)
      const data = parsedBody.data
      const productId = +req.params.id
      const pictureId = +req.params.pictureId
      
      if (!parsedBody.success) return res.status(402).json({ status: 401, errors })
      if (!data || !productId || !pictureId) return badRequest(res)

      const product = await Product.find(productId)
      const picture = await db.productPicture.findUnique({ where: { id: pictureId } })

      if (!product) return notFound(res, "This product doesn't exist.")
      if (!picture || product.id !== picture.productId) return notFound(res, "This picture doesn't exist.")

      const updatedPicture = await db.productPicture.update({
        where: { id: picture.id },
        data: {
          productId: product.id,
          url: data.url
        }
      })

      return res.status(200).json({
        data: updatedPicture,
        message: "Product picture hass been updated",
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

  static async deleteProductPicture(req: Request, res: Response) {
    
    try {
      const productId = +req.params.id
      const pictureId = +req.params.pictureId
      
      if (!productId || !pictureId) return badRequest(res)

      const product = await Product.find(productId)
      const picture = await db.productPicture.findUnique({ where: { id: pictureId } })

      if (!product) return notFound(res, "This product doesn't exist.")
      if (!picture || product.id !== picture.productId) return notFound(res, "This picture doesn't exist.")

      const deletedPicture = await db.productPicture.delete({
        where: { id: picture.id }
      })

      return res.status(200).json({
        data: deletedPicture,
        message: "Product picture hass been deleted.",
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

}