import { Request, Response } from "express"

import { createPagination, extractErrors } from "../../utlis/helpers"
import { badRequest, notFound } from "../../utlis/responses"
import { couponSchemas } from "../../schema"

import Coupon from "../models/Coupon"

import db from "../../utlis/db"

export default class CouponsController {

  static async get(req: Request, res: Response) {

    const { skip, limit, orderBy, orderType } = createPagination(req)
    try {
      const brands = await Coupon.all(skip, limit, orderBy, orderType)
      return res.status(200).json({
        status: 200,
        data: brands
      })
    } catch (error) {
      return badRequest(res, "Invalid search parameters.")
    }
  }

  static async getCoupon(req: Request, res: Response) {
    
    const couponId = req.params.id ? +req.params.id : null
    
    if (!couponId) return notFound(res)
    
    const coupon = await Coupon.find(couponId)

    if (!coupon) {
      return notFound(res, `This coupon with id ${couponId} wasn't found.`)
    }

    return res.status(200).json({
      data: coupon,
      status: 200
    })
  }
  
  static async updateCoupon(req: Request, res: Response) {
    
    const couponId = +req.params.id

    try {
      const coupon = await Coupon.find(couponId)
      const body = req.body
      
      if (!coupon) return notFound(res, "This coupon doesn't exist.")

      const parsedValidations = couponSchemas.update.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const updatedCoupon = await Coupon.update(coupon.id, parsedValidations.data)

      return res.status(200).json({
        data: updatedCoupon,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Coupon ID.")
    }
  }

  static async deleteCoupon(req: Request, res: Response) {
    
    const couponId = +req.params.id

    try {
      const coupon = await Coupon.find(couponId)

      if (!coupon) return notFound(res, "This brand doesn't exist.")

      const deletedCoupon = await Coupon.delete(coupon.id)

      return res.status(200).json({
        data: deletedCoupon,
        status: 200
      })

    } catch (error) {
      return badRequest(res, "Invalid Coupon ID.")
    }
  }

  static async createCoupon(req: Request, res: Response) {
    
    try {
      const body = req.body
      const parsedValidations = couponSchemas.create.safeParse(body)
      const errors = extractErrors(parsedValidations)
      
      if (!parsedValidations.success) return res.status(402).json({ status: 401, errors })

      const data = parsedValidations.data
      
      const findCoupon = await db.coupon.findFirst({
        where: { coupon: data.coupon }
      })
      
      if (findCoupon) return res.status(409).json({ message: "This coupon already exists.", status: 409 })

      const createdCoupon = await Coupon.create(data)

      return res.status(201).json({
        data: createdCoupon,
        status: 201
      })

    } catch (error) {
      return badRequest(res, "Something went wrong.")
    }
  }

  static async countStats(req: Request, res: Response) {
    const countCoupons = await db.coupon.count()
    return res.status(200).json({
      data: {
        coupons: countCoupons
      },
      status: 200
    })
  }

}