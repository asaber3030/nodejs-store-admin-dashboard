import { FindByField } from "../../types/app";

import db from "../../utlis/db";

export default class User {

  static selectors = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true
  }

  static async all(search: string = '', skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.user.findMany({
        where: {
          OR: [
            { name: { contains: search } },
            { email: { contains: search } },
          ]
        },
        select: User.selectors,
        skip,
        take,
        orderBy: {
          [orderBy]: orderType
        }
      })
    } catch (error) {
      return []
    }
  }

  static async addresses(userId: number) {
    return await db.address.findMany({
      where: { userId }
    })
  }

  static async orders(userId: number, skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    try {
      return await db.order.findMany({
        where: { userId },
        skip,
        take,
        orderBy: {
          [orderBy]: orderType
        }
      })
    } catch (error) {
      return []
    }
    
  }

  static async find(id: number, select: any = null) {
    return await db.user.findUnique({ 
      where: { id },
      select: select ? select : User.selectors
    })
  }

  static async findBy(value: string, by: FindByField = 'email') {
    switch(by) {
      case 'email':
        return await db.user.findUnique({ where: { email: value } })

      case 'username':
        return await db.user.findUnique({ where: { username: value } })

      default:
        return await db.user.findUnique({ where: { email: value } })
    }
  }
  
}