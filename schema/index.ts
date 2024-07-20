import { OrderStatus } from "@prisma/client"
import { z } from "zod"

export const orderSchemas = {
  
  update: z.object({
    couponId: z.number({ message: "Invalid Coupon ID." }).optional(),
    deliveryTaxes: z.number().gt(1, { message: "Delivery Taxes cannot be less than 1 price unit" }).optional(),
    discountValue: z.number().gt(1, { message: "Discount Value cannot be less than 1 price unit" }).optional(),
    status: z.enum([
      OrderStatus.Delivered, 
      OrderStatus.Ordered, 
      OrderStatus.Shipped
    ], { 
      message: `Invalid value for status it should only include [${OrderStatus.Ordered} | ${OrderStatus.Delivered} | ${OrderStatus.Shipped}]` 
    }).optional(),
    deliverIn: z.string().datetime({
      message: "Invalid date in 'Deliver in' field."
    }).optional()
  }),

  create: z.object({
    couponId: z.number({ message: "Invalid Coupon ID." }),
    userId: z.number({ message: "Invalid User ID." }),
    deliveryTaxes: z.number().gt(1, { message: "Delivery Taxes cannot be less than 1 price unit" }),
    discountValue: z.number().gt(1, { message: "Discount Value cannot be less than 1 price unit" }),
    subTotal: z.number().gt(1, { message: "Sub total cannot be less than 1 price unit" }),
    total: z.number().gt(1, { message: "Total cannot be less than 1 price unit" }),
    status: z.enum([
      OrderStatus.Delivered, 
      OrderStatus.Ordered, 
      OrderStatus.Shipped
    ], { 
      message: `Invalid value for status it should only include [${OrderStatus.Ordered} | ${OrderStatus.Delivered} | ${OrderStatus.Shipped}]` 
    }),
    deliverIn: z.string().datetime({
      message: "Invalid date in 'Deliver in' field."
    }),
    items: z.array(
      z.object({
        color: z.string().optional(),
        size: z.string().optional(),
        quantity: z.number({ message: "Quantity is required." }).gt(0),
        unitPrice: z.number({ message: "Unit Price is required." }).gt(0),
        totalPrice: z.number({ message: "Total Price is required." }).gt(0),
        orderId: z.number({ message: "orderId is required." }).gt(0),
        productId: z.number({ message: "productId is required." }).gt(0),
      })
    , { message: "Please make sure to provide the order items. including: [color?, size?, quantity, unitPrice, totalPrice, orderId, productId]. `?` means optional." })
  })

}

export const brandSchemas = {
  
  update: z.object({
    name: z.string({ message: "Brand name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    description: z.string({ message: "Brand Description must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    logo: z
      .string({ 
        message: "Brand Logo must be string" 
      })
      .url({ 
        message: "Brand Logo must be a valid URL."
      })
      .optional(),
  }),


  create: z.object({
    name: z.string({ message: "Brand name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
    description: z.string({ message: "Brand Description must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
    logo: z
      .string({ 
        message: "Brand Logo must be string" 
      })
      .url({ 
        message: "Brand Logo must be a valid URL."
      })
  })

}

export const couponSchemas = {
  
  update: z.object({
    coupon: z.string({ message: "Coupon name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    discount: z.number().gte(1, { message: 'Cannot be less than 1%' }).lte(100, { message: 'Cannot be greater that 100%' }).optional(),
    active: z.boolean().optional(),
    usages: z.number().optional(),
  }),

  create: z.object({
    coupon: z.string({ message: "Coupon name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
    discount: z.number().gte(1, { message: 'Cannot be less than 1%' }).lte(100, { message: 'Cannot be greater that 100%' }),
    active: z.boolean(),
    usages: z.number(),
  })

}

export const categorySchemas = {
  
  update: z.object({
    name: z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    icon: z.string().url({ message: "Category Icon Must be a URL" }).optional(),
    keywords: z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
  }),

  create: z.object({
    name: z.string().max(255, { message: "Cannot be greater than 255 characters" }),
    icon: z.string().url({ message: "Category Icon Must be a URL" }),
    keywords: z.string().max(255, { message: "Cannot be greater than 255 characters" }),
  })

}

export const productSchemas = {
  
  update: z.object({
    name: z.string().min(4, { message: "Product name cannot be less than 4 characters." }).max(500, { message: "Product name cannot be more that 500 characters." }).optional(),
    description: z.string().min(20, { message: "Product name cannot be less than 20 characters." }).max(1500, { message: "Product name cannot be more that 1500 characters." }).optional(),
    picture: z.string().url().optional(),
    price: z.number().gt(0, { message: "Price cannot be 0." }).optional(),
    quantity: z.number().optional(),
    categoryId: z.number().optional(),
    brandId: z.number().optional()
  }),

  create: z.object({
    name: z.string().min(4, { message: "Product name cannot be less than 4 characters." }).max(500, { message: "Product name cannot be more that 500 characters." }),
    description: z.string().min(20, { message: "Product name cannot be less than 20 characters." }).max(1500, { message: "Product name cannot be more that 1500 characters." }),
    picture: z.string().url(),
    price: z.number().gt(0, { message: "Price cannot be 0." }),
    quantity: z.number().nullable(),
    categoryId: z.number(),
    brandId: z.number()
  })

}

export const productPictureSchema = {

  create: z.object({
    url: z.string().url()
  }),

  update: z.object({
    url: z.string().url()
  })

}

export const userSchema = {
  
  login: z.object({
    email: z.string().email({ message: "Email is required." }),
    password: z.string()
  }),

  create: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }),
    username: z.string().min(3, { message: "Username cannot be less than 1 characters." }),
    email: z.string().email({ message: "Invalid Email." }),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }),
    phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }),
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
    username: z.string().min(3, { message: "Username cannot be less than 1 characters." }).optional(),
    email: z.string().email({ message: "Invalid Email." }).optional(),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
    phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }).optional(),
  })
 
}

export const adminSchema = {

  login: z.object({
    email: z.string().email({ message: "Email is required." }),
    password: z.string()
  }),

  create: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }),
    email: z.string().email({ message: "Invalid Email." }),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }),
    phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }),
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
    email: z.string().email({ message: "Invalid Email." }).optional(),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
    phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }).optional(),
  })
  
}