import { Prisma } from "@prisma/client";

import db from "../../utlis/db";

export default class Order {

  static selectors = {}

  static async find(id: number) {
    return await db.order.findUnique({ 
      where: { id },
      include: { coupon: true }
    })
  }

  static async findOrderByCode(value: string) {
    return await db.order.findUnique({ where: { code: value } })
  }

  static async all(skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.order.findMany({
      skip,
      take,
      orderBy: {
        [orderBy]: orderType
      }
    })
  }

  static async findItems(id: number) {
    return await db.orderItem.findMany({ 
      where: { orderId: id },
      include: {
        product: true
      }
    })
  }
  
  static async delete(id: number) {
    return await db.order.delete({
      where: { id }
    })
  }

  static async update(id: number, data: Prisma.OrderUpdateInput) {
    return await db.order.update({
      where: { id },
      data
    })
  }

}