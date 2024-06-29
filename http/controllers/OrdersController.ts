import { Request, Response } from "express"

import { createPagination, extractErrors, generateOrderId } from "../../utlis/helpers"
import { badRequest, notFound } from "../../utlis/responses"
import { orderSchemas } from "../../schema"

import Order from "../models/Order"
import User from "../models/User"

import db from "../../utlis/db"

export default class OrdersController {

  static async get(req: Request, res: Response) {

    const { skip, limit, orderBy, orderType } = createPagination(req)

    const orders = await Order.all(skip, limit, orderBy, orderType)

    return res.status(200).json({
      status: 200,
      data: orders
    })
  }

  static async getOrder(req: Request, res: Response) {
    
    const orderId = req.params.id ? +req.params.id : null
    
    if (!orderId) {
      return notFound(res)
    }
    
    const order = await Order.find(orderId)

    if (!order) {
      return notFound(res, `This order with id ${orderId} wasn't found.`)
    }

    return res.status(200).json({
      data: order
    })
  }

  static async getOrderItems(req: Request, res: Response) {
    
    const orderId = req.params.id ? +req.params.id : null
    
    if (!orderId) {
      return notFound(res)
    }
    
    const order = await Order.find(orderId)
    const items = await Order.findItems(orderId)

    if (!order) {
      return notFound(res, `This order with id ${orderId} wasn't found.`)
    }

    return res.status(200).json({
      data: items,
      status: 200
    })
  }

  static async getOrderOwner(req: Request, res: Response)  {
    try {
      const order = await db.order.findUnique({
        where: { id: +req.params.id }
      })
      if (!order) return notFound(res, "This order doesn't exists.")

      const user = await User.find(order.userId)

      return res.status(200).json({
        data: user,
        status: 200
      })

    } catch (err) {
      return badRequest(res, "Invalid order ID.")
    }
   
  }
  
  static async updateOrder(req: Request, res: Response) {
    
    const orderId = +req.params.id

    try {
      const order = await Order.find(orderId)
      const body = req.body
      
      if (!order) return notFound(res, "This order doesn't exist.")

      const parsedValidations = orderSchemas.update.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const updatedOrder = await Order.update(order.id, parsedValidations.data)

      return res.status(200).json({
        data: updatedOrder,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Order ID.")
    }
  }

  static async deleteOrder(req: Request, res: Response) {
    
    const orderId = +req.params.id

    try {
      const order = await Order.find(orderId)

      if (!order) return notFound(res, "This order doesn't exist.")

      const deletedOrder = await Order.delete(order.id)

      return res.status(200).json({
        data: deletedOrder,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Order ID.")
    }
  }

  static async createOrder(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedValidations = orderSchemas.create.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      let generetedCode = generateOrderId()
      
      const findOrder = await db.order.findUnique({ where: { code: generetedCode }, select: { id: true } })
      const data = parsedValidations.data

      if (findOrder) generetedCode = generateOrderId()

      const createdOrder = await db.order.create({
        data: {
          ...data,
          code: generetedCode
        }
      })

      return res.status(201).json({
        data: createdOrder,
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

}