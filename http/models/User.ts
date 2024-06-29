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