import { Prisma } from "@prisma/client";

import db from "../../utlis/db";

export default class Brand {

  static selectors = {}

  static async find(id: number) {
    return await db.brand.findUnique({ 
      where: { id }
    })
  }

  static async all(skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.brand.findMany({
      skip,
      take,
      orderBy: {
        [orderBy]: orderType
      }
    })
  }

  static async products(brandId: number) {
    return await db.product.findMany({ 
      where: { brandId }
    })
  }
  
  static async delete(id: number) {
    return await db.brand.delete({
      where: { id }
    })
  }

  static async update(id: number, data: Prisma.BrandUpdateInput) {
    return await db.brand.update({
      where: { id },
      data
    })
  }

  static async create(data: Prisma.BrandCreateInput) {
    return await db.brand.create({
      data
    })
  }

}