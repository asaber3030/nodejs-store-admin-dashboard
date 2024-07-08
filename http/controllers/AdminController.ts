import { Request, Response } from "express"
import { TAdmin } from "../../types"

import { createPagination, extractErrors, extractToken } from "../../utlis/helpers"
import { adminSchema } from "../../schema"
import { unauthorized } from "../../utlis/responses"

import db from "../../utlis/db"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Admin from "../models/Admin"

export default class AdminController {
  
  static secret: string = process.env.APP_SECRET!;

  static async login(req: Request, res: Response) {
    
    const body = adminSchema.login.safeParse(req.body)
    const data = body.data

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors."
      })
    }

    if (!data) {
      return res.status(400).json({
        message: "Something went wrong while submitting data.",
        status: 400
      }) 
    }

    const user = await Admin.findBy(data.email)

    if (!user) {
      return res.status(404).json({
        message: "No user was found.",
        status: 404
      })
    }
    
    const comparePasswords = await bcrypt.compare(data.password, user.password)

    if (!comparePasswords) {
      return res.status(400).json({
        message: "Invalid email or password."
      })
    }

    const { password, ...mainUser } = user

    const secert = process.env.APP_SECRET
    const token = jwt.sign(mainUser, secert!)

    return res.status(200).json({
      message: "Logged in successfully.",
      status: 200,
      data: { token }
    })

  }

  static async register(req: Request, res: Response) {
    
    const body = adminSchema.create.safeParse(req.body)
    const data = body.data

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors.",
        status: 400
      })
    }

    if (!data) {
      return res.status(400).json({
        message: "Please check there's valid JSON data in the request body.",
        status: 400
      }) 
    }

    const userByEmail = await Admin.findBy(data.email)
    const userByPhone = await db.admin.findFirst({ where: { phone: data.phone as any } })

    if (userByEmail) {
      return res.status(409).json({
        message: "E-mail Already exists.",
        status: 409
      })
    }
    if (userByPhone) {
      return res.status(409).json({
        message: "Phone Number Already exists.",
        status: 409
      })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = await db.admin.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: hashedPassword
      }
    })

    const { password, ...mainUser } = newUser

    const secert = process.env.APP_SECRET
    const token = jwt.sign(mainUser, secert!)

    return res.status(201).json({
      message: "Admin Registered successfully.",
      status: 201,
      data: {
        user: mainUser,
        token
      }
    })

  }

  static async authorize(req: Request, res: Response) {
    
    const token = extractToken(req.headers.authorization!)
    const adminToken = jwt.verify(token, AdminController.secret) as TAdmin & { iat: number }
    const admin = await db.admin.findUnique({
      where: { id: adminToken.id },
      select: Admin.selectors
    })

    if (!admin) {
      return res.status(401).json({
        message: "Unauthorized admin.",
        authorized: false
      })
    }
    return res.status(200).json({
      message: "Authorized.",
      authorized: true,
      data: admin
    })
    
  }

  static async isAdmin(req: Request) {
    const token = extractToken(req.headers.authorization!)
    if (!token) return false
    try {
      const adminToken = jwt.verify(token, AdminController.secret) as TAdmin & { iat: number }
      const admin = await db.admin.findUnique({
        where: { id: adminToken.id },
        select: Admin.selectors
      })
      if (!admin) {
        return false
      }
      return true
    } catch (error) {
      return false
    }
  }

  static async admin(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!)
    if (!token) {
      return unauthorized(res)
    }
    const tokenAdmin = jwt.verify(token, AdminController.secret) as TAdmin & { iat: number }
    try {
      const admin = await db.admin.findUnique({
        where: { id: tokenAdmin.id },
        select: Admin.selectors
      })
      if (admin) {
        return res.status(200).json({ status: 200, data: admin })
      }
      return res.status(400).json({ 
        status: 404,
        message: "Invalid Admin, Or Expired Token. This admin might be removed from database." 
      })
    } catch {
      return res.status(400).json({ 
        status: 404,
        message: "Invalid Admin, Or Expired Token. This admin might be removed from database." 
      })
    }
    
  }

  static async get(req: Request, res: Response) {

    const { limit, skip, orderBy, orderType } = createPagination(req)

    const searchParam = req.query.search as string ? req.query.search : '' as string
    const admins = await Admin.all(searchParam as string, skip, limit, orderBy, orderType)

    return res.status(200).json({
      data: admins,
      status: 200, 
      message: "Admins Data"
    })
  }

  static async update(req: Request, res: Response) {
    
    const body = adminSchema.update.safeParse(req.body)
    const data = body.data

    const adminId = req.params.adminId ? +req.params.adminId : null
    
    if (!adminId) return res.status(500).json({ message: "Invalid Admin ID", status: 500 })
    
    const adminData = await db.admin.findUnique({
      where: { id: adminId }
    })

    if (!adminData) return res.status(404).json({ message: "Admin doesn't exist", status: 404 })

    if (!body.success) {
      const errors = extractErrors(body)
      return res.status(400).json({
        errors,
        message: "Form validation errors.",
        status: 400
      })
    }

    if (!data) {
      return res.status(400).json({
        message: "Please check there's valid JSON data in the request body.",
        status: 400
      }) 
    }

    const userByEmail = await db.admin.findUnique({
      where: {
        email: data.email,
        AND: [
          { id: { not: adminId } }
        ]
      }
    })
    const userByPhone = await db.admin.findFirst({
      where: {
        phone: data.phone,
        AND: [
          { id: { not: adminId } }
        ]
      }
    })

    if (userByEmail) {
      return res.status(409).json({
        message: "E-mail Already exists.",
        status: 409
      })
    }
    if (userByPhone) {
      return res.status(409).json({
        message: "Phone Number Already exists.",
        status: 409
      })
    }

    let pass = adminData.password;
    
    if (data.password) {
      pass = await bcrypt.hash(data.password!, 10)
    }
    const updatedUser = await db.admin.update({
      where: { 
        id: adminId
      },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: pass
      }
    })

    const { password, ...mainUser } = updatedUser

    return res.status(201).json({
      message: "Admin has been updated successfully.",
      status: 201,
      data: mainUser
    })

  }

  static async delete(req: Request, res: Response) {
    const adminId = req.params.adminId ? +req.params.adminId : null
    
    if (!adminId) return res.status(500).json({ message: "Invalid Admin ID", status: 500 })
    
    const adminData = await db.admin.findUnique({
      where: { id: adminId }
    })

    if (!adminData) return res.status(404).json({ message: "Admin doesn't exist", status: 404 })

    const deletedUser = await db.admin.delete({
      where: { 
        id: adminId
      }
    })

    const { password, ...mainUser } = deletedUser

    return res.status(201).json({
      message: "Admin has been deleted successfully.",
      status: 201,
      data: mainUser
    })
  }

}