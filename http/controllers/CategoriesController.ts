import { Request, Response } from "express"

import { createPagination, extractErrors } from "../../utlis/helpers"
import { badRequest, notFound } from "../../utlis/responses"
import { categorySchemas } from "../../schema"

import db from "../../utlis/db"
import Category from "../models/Category"
import { Prisma } from "@prisma/client"

export default class CategoriesController {

  static async get(req: Request, res: Response) {

    const { skip, limit, orderBy, orderType } = createPagination(req)
    try {
      const categories = await Category.all(skip, limit, orderBy, orderType)
      return res.status(200).json({
        status: 200,
        data: categories
      })
    } catch (error) {
      return badRequest(res, "Invalid search parameters.")
    }
  }

  static async getCategory(req: Request, res: Response) {
    
    const categoryId = req.params.id ? +req.params.id : null
    
    if (!categoryId) return notFound(res)
    
    const category = await Category.find(categoryId)

    if (!category) {
      return notFound(res, `This category with id ${categoryId} wasn't found.`)
    }

    return res.status(200).json({
      data: category,
      status: 200
    })
  }

  static async getCategoryProducts(req: Request, res: Response) {
    
    const categoryId = req.params.id ? +req.params.id : null
    const searchParam = req.query.search ? req.query.search : ''

    const { skip, limit, orderBy, orderType } = createPagination(req)
    
    if (!categoryId) return notFound(res)
    
    const category = await Category.find(categoryId)

    if (!category) {
      return notFound(res, `This Category with id ${categoryId} wasn't found.`)
    }

    const products = await db.product.findMany({
      where: { 
        AND: [
          { categoryId },
          { name: { contains: searchParam as string } }
        ],
        OR: [
          { categoryId },
          { description: { contains: searchParam as string } }
        ],
      },
      skip,
      take: limit,
      orderBy: {
        [orderBy]: orderType
      }
    })
    return res.status(200).json({
      data: products,
      status: 200
    })
  }

  
  static async updateCategory(req: Request, res: Response) {
    
    const categoryId = +req.params.id

    try {
      const category = await Category.find(categoryId)
      const body = req.body
      
      if (!category) return notFound(res, "This category doesn't exist.")

      const parsedValidations = categorySchemas.update.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const updatedCategory = await Category.update(category.id, parsedValidations.data)

      return res.status(200).json({
        data: updatedCategory,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Category ID.")
    }
  }

  static async deleteCategory(req: Request, res: Response) {
    
    const categoryId = +req.params.id

    try {
      const category = await Category.find(categoryId)

      if (!category) return notFound(res, "This category doesn't exist.")

      const deletedCategory = await Category.delete(category.id)

      return res.status(200).json({
        data: deletedCategory,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Category ID.")
    }
  }

  static async createCategory(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedValidations = categorySchemas.create.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const data = parsedValidations.data
      
      const findCategory = await db.category.findFirst({
        where: { name: data.name }
      })
      
      if (findCategory) return res.status(409).json({ message: "This category already exists.", status: 409 })

      const created = await Category.create(data)

      return res.status(201).json({
        data: created,
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

}