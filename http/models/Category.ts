import { Prisma } from "@prisma/client";

import db from "../../utlis/db";

export default class Category {

  static selectors = {
    id: true,
    name: true,
    icon: true,
    keywords: true,
    createdAt: true,
    updatedAt: true
  }

  static async find(id: number) {
    return await db.category.findUnique({ 
      where: { id },
      select: { ...Category.selectors, _count: { select: { products: true } } }
    })
  }

  static async all(skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.category.findMany({
      skip,
      take,
      select: {
        id: true,
        name: true,
        icon: true,
        keywords: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { products: true } },
      },
      orderBy: {
        [orderBy]: orderType
      }
    })
  }

  static async products(categoryId: number) {
    return await db.product.findMany({ 
      where: { categoryId }
    })
  }
  
  static async delete(id: number) {
    return await db.category.delete({
      where: { id }
    })
  }

  static async update(id: number, data: Prisma.CategoryUpdateInput) {
    return await db.category.update({
      where: { id },
      data
    })
  }

  static async create(data: Prisma.CategoryCreateInput) {
    return await db.category.create({
      data
    })
  }

}