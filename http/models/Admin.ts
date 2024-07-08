import { FindByField } from "../../types";

import db from "../../utlis/db";

export default class Admin {

  static selectors = {
    id: true,
    name: true,
    email: true,
    phone: true,
    createdAt: true,
    updatedAt: true
  }

  static async all(search: string = '', skip: number = 0, take: number = 10, orderBy: string = 'id', orderType: string = 'desc') {
    return await db.admin.findMany({
      where: {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ]
      },
      select: Admin.selectors,
      skip,
      take,
      orderBy: {
        [orderBy]: orderType
      }
    })
  }

  static async find(id: number) {
    return await db.admin.findUnique({ where: { id } })
  }

  static async findBy(value: string, by: FindByField = 'email') {
    switch(by) {
      case 'email':
        return await db.admin.findUnique({ where: { email: value } })

      default:
        return await db.admin.findUnique({ where: { email: value } })
    }
  }
  
}