import { Request, Response } from "express"

import { loginSchema } from "../../types/auth"
import { extractErrors, extractToken } from "../../utlis/helpers"
import { unauthorized } from "../../utlis/responses"

import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

import Admin from "../models/Admin"

export default class AdminController {
  
  static secret: string = process.env.APP_SECRET!;

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

    const user = await Admin.findBy(data.email)

    if (!user) {
      return res.status(404).json({
        message: "No user was found."
      })
    }

    
    const comparePasswords = await bcrypt.compare(data?.password, user.password)

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
      token
    })

  }

  static authorize(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!)
    const user = jwt.verify(token, AdminController.secret)
    if (!user) {
      return res.status(401).json({
        message: "Unauthorized user.",
        authorized: false
      })
    }
    return res.status(200).json({
      message: "Authorized.",
      authorized: true,
      user
    })
  }

  static isAdmin(req: Request) {
    const token = extractToken(req.headers.authorization!)
    if (!token) return false
    try {
      const user = jwt.verify(token, AdminController.secret)
      return user ? true : false
    } catch (error) {
      return false
    }
  }

  static admin(req: Request, res: Response) {
    const token = extractToken(req.headers.authorization!)
    if (!token) {
      return unauthorized(res)
    }
    const admin = jwt.verify(token, AdminController.secret)
    return res.status(200).json({ data: admin })
  }

}