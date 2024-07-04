import { Request, Response } from "express"

import { loginSchema } from "../../types/auth"
import { createPagination, extractErrors } from "../../utlis/helpers"
import { userSchema } from "../../schema"

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from "../../utlis/db"
import User from "../models/User"

export default class UserController {
  
  static secret: string = process.env.APP_USER_SECRET!;

  static async login(req: Request, res: Response) {
    
    const body = loginSchema.safeParse(req.body)
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
        message: "Something went wrong while submitting data."
      }) 
    }

    const user = await User.findBy(data.email)

    if (!user) {
      return res.status(404).json({
        message: "No user was found."
      })
    }
    
    const comparePasswords = await bcrypt.compare(data.password, user.password)

    if (!comparePasswords) {
      return res.status(400).json({
        message: "Invalid email or password."
      })
    }

    const { password, ...mainUser } = user

    const token = jwt.sign(mainUser, UserController.secret!)

    return res.status(200).json({
      message: "Logged in successfully.",
      token
    })

  }

  static async register(req: Request, res: Response) {
    
    const body = userSchema.create.safeParse(req.body)
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

    const userByEmail = await User.findBy(data.email)
    const userByPhone = await db.user.findUnique({ where: { phone: data.phone } })
    const userByUsername = await db.user.findUnique({ where: { username: data.username } })

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
    if (userByUsername) {
      return res.status(409).json({
        message: "Username Already exists.",
        status: 409
      })
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)
    const newUser = await db.user.create({
      data: {
        ...data,
        password: hashedPassword
      }
    })

    const { password, ...mainUser } = newUser

    const secert = process.env.APP_USER_SECRET
    const token = jwt.sign(mainUser, secert!)

    return res.status(201).json({
      message: "User Registered successfully.",
      status: 201,
      token,
      data: mainUser
    })

  }

  static async get(req: Request, res: Response) {

    const { limit, skip, orderBy, orderType } = createPagination(req)

    const searchParam = req.query.search as string ? req.query.search : '' as string
    const users = await User.all(searchParam as string, skip, limit, orderBy, orderType)

    return res.status(200).json({
      data: users,
      status: 200, 
      message: "Users Data"
    })
  }

  static async addresses(req: Request, res: Response) {

    const userId = req.params.userId ? +req.params.userId : null
    
    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    
    const userData = await db.user.findUnique({
      where: { id: userId }
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })

    const addresses = await User.addresses(userId)

    return res.status(200).json({
      data: addresses,
      status: 200, 
      message: `User [${userId}] Addresses`
    })
  }

  static async orders(req: Request, res: Response) {

    const { skip, limit, orderBy, orderType } = createPagination(req)

    const userId = req.params.userId ? +req.params.userId : null
    
    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    
    const userData = await db.user.findUnique({
      where: { id: userId }
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })

    const orders = await User.orders(userId, skip, limit, orderBy, orderType)

    return res.status(200).json({
      data: orders,
      status: 200, 
      message: `User [${userId}] Orders`
    })
  }

  static async user(req: Request, res: Response) {

    const userId = req.params.userId ? +req.params.userId : null
    
    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    
    const userData = await db.user.findUnique({
      where: { id: userId },
      select: User.selectors
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })

    return res.status(200).json({
      data: userData,
      status: 200, 
      message: `User Details [${userId}]`
    })
  }

  static async getOrder(req: Request, res: Response) {

    const userId = req.params.userId ? +req.params.userId : null
    const orderId = req.params.orderId ? +req.params.orderId : null
    
    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    if (!orderId) return res.status(500).json({ message: "Invalid Order ID", status: 500 })
    
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
        coupon: true,
      }
    })

    const userData = await db.user.findUnique({
      where: { id: userId },
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })
    if (!order || (order.userId !== userData.id)) return res.status(404).json({ message: "Order doesn't exist", status: 404 })

    return res.status(200).json({
      data: order,
      status: 200, 
      message: `Order Details [${orderId}]`
    })
  }

  static async update(req: Request, res: Response) {
    
    const body = userSchema.update.safeParse(req.body)
    const data = body.data

    const userId = req.params.userId ? +req.params.userId : null
    
    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    
    const userData = await db.user.findUnique({
      where: { id: userId }
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })

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

    if (data.email) {
      const userByEmail = await db.user.findUnique({
        where: {
          email: data.email,
          AND: [
            { id: { not: userId } }
          ]
        }
      })
      if (userByEmail) {
        return res.status(409).json({
          message: "E-mail Already exists.",
          status: 409
        })
      }
    }

    if (data.phone) {
      const userByPhone = await db.user.findFirst({
        where: {
          phone: data.phone,
          AND: [
            { id: { not: userId } }
          ]
        }
      })
      if (userByPhone) {
        return res.status(409).json({
          message: "Phone Number Already exists.",
          status: 409
        })
      }
    }

    if (data.username) {
      const userByUsername = await db.user.findFirst({
        where: {
          username: data.username,
          AND: [
            { id: { not: userId } }
          ]
        }
      })
      if (userByUsername) {
        return res.status(409).json({
          message: "Username Already exists.",
          status: 409
        })
      }
    }


    let pass = userData.password;
    
    if (data.password) {
      pass = await bcrypt.hash(data.password!, 10)
    }

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        username: data.username,
        phone: data.phone,
        password: pass
      }
    })

    const { password, ...mainUser } = updatedUser

    return res.status(201).json({
      message: "User has been updated successfully.",
      status: 201,
      data: mainUser
    })

  }

  static async delete(req: Request, res: Response) {
    const userId = req.params.userId ? +req.params.userId : null

    if (!userId) return res.status(500).json({ message: "Invalid User ID", status: 500 })
    
    const userData = await db.user.findUnique({
      where: { id: userId }
    })

    if (!userData) return res.status(404).json({ message: "User doesn't exist", status: 404 })

    const deletedUser = await db.user.delete({
      where: { 
        id: userId
      }
    })

    const { password, ...mainUser } = deletedUser

    return res.status(201).json({
      message: "User has been deleted successfully.",
      status: 201,
      data: mainUser
    })
  }

}