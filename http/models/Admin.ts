import { FindByField } from "../../types/app";

import db from "../../utlis/db";

export default class Admin {

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