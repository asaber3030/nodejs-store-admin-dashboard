import { Request, Response } from "express"

import { createPagination, extractErrors } from "../../utlis/helpers"
import { badRequest, notFound } from "../../utlis/responses"
import { brandSchemas } from "../../schema"

import Brand from "../models/Brand"
import db from "../../utlis/db"

export default class BrandsController {

  static async get(req: Request, res: Response) {

    const { skip, limit, orderBy, orderType } = createPagination(req)
    try {
      const brands = await Brand.all(skip, limit, orderBy, orderType)
      return res.status(200).json({
        status: 200,
        data: brands
      })
    } catch (error) {
      return badRequest(res, "Invalid search parameters.")
    }
  }

  static async getBrand(req: Request, res: Response) {
    
    const brandId = req.params.id ? +req.params.id : null
    
    if (!brandId) return notFound(res)
    
    const brand = await Brand.find(brandId)

    if (!brand) {
      return notFound(res, `This brand with id ${brandId} wasn't found.`)
    }

    return res.status(200).json({
      data: brand,
      status: 200
    })
  }

  static async getBrandProducts(req: Request, res: Response) {
    
    const brandId = req.params.id ? +req.params.id : null
    
    if (!brandId) return notFound(res)
    
    const brand = await Brand.find(brandId)
    const products = await Brand.products(brandId)

    if (!brand) {
      return notFound(res, `This brand with id ${brandId} wasn't found.`)
    }

    return res.status(200).json({
      data: products,
      status: 200
    })
  }

  static async updateBrand(req: Request, res: Response) {
    
    const brandId = +req.params.id

    try {
      const brand = await Brand.find(brandId)
      const body = req.body
      
      if (!brand) return notFound(res, "This brand doesn't exist.")

      const parsedValidations = brandSchemas.update.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const updatedBrand = await Brand.update(brand.id, parsedValidations.data)

      return res.status(200).json({
        data: updatedBrand,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Brand ID.")
    }
  }

  static async deleteBrand(req: Request, res: Response) {
    
    const brandId = +req.params.id

    try {
      const brand = await Brand.find(brandId)

      if (!brand) return notFound(res, "This brand doesn't exist.")

      const deletedBrand = await Brand.delete(brand.id)

      return res.status(200).json({
        data: deletedBrand,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Brand ID.")
    }
  }

  static async createBrand(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedValidations = brandSchemas.create.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const data = parsedValidations.data
      
      const findBrand = await db.brand.findFirst({
        where: { name: data.name }
      })
      
      if (findBrand) return res.status(409).json({ message: "This brand already exists.", status: 409 })

      const createdBrand = await Brand.create(data)

      return res.status(201).json({
        data: createdBrand,
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

  static async countStats(req: Request, res: Response) {
    const countBrands = await db.brand.count()
    return res.status(200).json({
      message: "Brand counts.",
      data: {
        brands: countBrands
      },
      status: 200
    })
  }

}