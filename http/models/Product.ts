import { Prisma } from "@prisma/client";

import db from "../../utlis/db";

export default class Product {

  static selectors = {}

  static async find(id: number) {
    return await db.product.findUnique({ 
      where: { id },
      include: {
        category: true,
        brand: true,
        pictures: true
      }
    })
  }

  static async all(search: string = '', skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.product.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { description: { contains: search } },
        ]
      },
      skip,
      take,
      orderBy: {
        [orderBy]: orderType
      }
    })
  }
  
  static async delete(id: number) {
    return await db.product.delete({
      where: { id }
    })
  }

  static async update(id: number, data: Prisma.ProductUpdateInput) {
    return await db.product.update({
      where: { id },
      data
    })
  }

  static async create(data: Prisma.ProductCreateInput) {
    return await db.product.create({
      data
    })
  }

}