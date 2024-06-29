import { Prisma } from "@prisma/client";

import db from "../../utlis/db";

export default class Coupon {

  static selectors = {}

  static async find(id: number) {
    return await db.coupon.findUnique({ 
      where: { id }
    })
  }

  static async all(skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.coupon.findMany({
      skip,
      take,
      orderBy: {
        [orderBy]: orderType
      }
    })
  }

  
  static async delete(id: number) {
    return await db.coupon.delete({
      where: { id }
    })
  }

  static async update(id: number, data: Prisma.CouponUpdateInput) {
    return await db.coupon.update({
      where: { id },
      data
    })
  }

  static async create(data: Prisma.CouponCreateInput) {
    return await db.coupon.create({
      data
    })
  }

}