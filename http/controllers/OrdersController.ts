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

      const parsedData = orderSchemas.update.safeParse(body)
      const errors = extractErrors(parsedData)
      
      if (!parsedData.success) return res.status(402).json({ status: 401, errors })

      const updatedOrder = await Order.update(order.id, parsedData.data)

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
      const parsedData = orderSchemas.create.safeParse(req.body)
      const errors = extractErrors(parsedData)
      
      if (!parsedData.success) return res.status(402).json({ status: 401, errors })

      let generetedCode = generateOrderId()
      
      const findOrder = await db.order.findUnique({ where: { code: generetedCode }, select: { id: true } })
      const data = parsedData.data

      const coupon = await db.coupon.findUnique({ where: { id: data.couponId } })
      const user = await db.user.findUnique({ where: { id: data.userId } })

      if (!coupon) return notFound(res, "Coupon with provided id doesn't exist.")
      if (!user) return notFound(res, "User with provided id doesn't exist.")

      if (!coupon.active) return res.status(401).json({ message: "This coupon is currently inactive." })
      if (coupon.usages === 0) return res.status(401).json({ message: "This coupon usages times is currently '0'. cannot use it anymore." })

      await db.coupon.update({
        where: { id: coupon.id },
        data: { usages: coupon.usages === 0 ? coupon.usages : coupon.usages - 1 }
      })

      while (findOrder) {
        generetedCode = generateOrderId()
      }

      const createdOrder = await db.order.create({
        data: {
          status: data.status,
          subTotal: data.subTotal,
          total: data.total,
          discountValue: data.discountValue,
          deliveryTaxes: data.deliveryTaxes,
          userId: data.userId,
          couponId: data.couponId,
          deliverIn: data.deliverIn,
          code: generetedCode,
        }
      })

      try {
        data.items.forEach(async (item) => {
          const newItem = await db.orderItem.create({
            data: {
              ...item,
              orderId: createdOrder.id
            }
          })
        })
      } catch {
        return notFound(res, "Please check productId, and orderId.")
      }

      return res.status(201).json({
        data: createdOrder,
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

}