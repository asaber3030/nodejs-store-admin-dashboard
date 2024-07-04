"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSchema = exports.productPictureSchema = exports.productSchemas = exports.categorySchemas = exports.couponSchemas = exports.brandSchemas = exports.orderSchemas = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.orderSchemas = {
    update: zod_1.z.object({
        couponId: zod_1.z.number({ message: "Invalid Coupon ID." }).optional(),
        deliveryTaxes: zod_1.z.number().gt(1, { message: "Delivery Taxes cannot be less than 1 price unit" }).optional(),
        discountValue: zod_1.z.number().gt(1, { message: "Discount Value cannot be less than 1 price unit" }).optional(),
        status: zod_1.z.enum([
            client_1.OrderStatus.Delivered,
            client_1.OrderStatus.Ordered,
            client_1.OrderStatus.Shipped
        ], {
            message: `Invalid value for status it should only include [${client_1.OrderStatus.Ordered} | ${client_1.OrderStatus.Delivered} | ${client_1.OrderStatus.Shipped}]`
        }).optional(),
        deliverIn: zod_1.z.string().datetime({
            message: "Invalid date in 'Deliver in' field."
        }).optional()
    }),
    create: zod_1.z.object({
        couponId: zod_1.z.number({ message: "Invalid Coupon ID." }),
        userId: zod_1.z.number({ message: "Invalid User ID." }),
        deliveryTaxes: zod_1.z.number().gt(1, { message: "Delivery Taxes cannot be less than 1 price unit" }),
        discountValue: zod_1.z.number().gt(1, { message: "Discount Value cannot be less than 1 price unit" }),
        subTotal: zod_1.z.number().gt(1, { message: "Sub total cannot be less than 1 price unit" }),
        total: zod_1.z.number().gt(1, { message: "Total cannot be less than 1 price unit" }),
        status: zod_1.z.enum([
            client_1.OrderStatus.Delivered,
            client_1.OrderStatus.Ordered,
            client_1.OrderStatus.Shipped
        ], {
            message: `Invalid value for status it should only include [${client_1.OrderStatus.Ordered} | ${client_1.OrderStatus.Delivered} | ${client_1.OrderStatus.Shipped}]`
        }),
        deliverIn: zod_1.z.string().datetime({
            message: "Invalid date in 'Deliver in' field."
        }),
    })
};
exports.brandSchemas = {
    update: zod_1.z.object({
        name: zod_1.z.string({ message: "Brand name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        description: zod_1.z.string({ message: "Brand Description must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        logo: zod_1.z
            .string({
            message: "Brand Logo must be string"
        })
            .url({
            message: "Brand Logo must be a valid URL."
        })
            .optional(),
    }),
    create: zod_1.z.object({
        name: zod_1.z.string({ message: "Brand name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
        description: zod_1.z.string({ message: "Brand Description must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
        logo: zod_1.z
            .string({
            message: "Brand Logo must be string"
        })
            .url({
            message: "Brand Logo must be a valid URL."
        })
    })
};
exports.couponSchemas = {
    update: zod_1.z.object({
        coupon: zod_1.z.string({ message: "Coupon name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        discount: zod_1.z.number().gte(1, { message: 'Cannot be less than 1%' }).lte(100, { message: 'Cannot be greater that 100%' }).optional(),
        active: zod_1.z.boolean().optional(),
        usages: zod_1.z.number().optional(),
    }),
    create: zod_1.z.object({
        coupon: zod_1.z.string({ message: "Coupon name must be string" }).max(255, { message: "Cannot be greater than 255 characters" }),
        discount: zod_1.z.number().gte(1, { message: 'Cannot be less than 1%' }).lte(100, { message: 'Cannot be greater that 100%' }),
        active: zod_1.z.boolean(),
        usages: zod_1.z.number(),
    })
};
exports.categorySchemas = {
    update: zod_1.z.object({
        name: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        keywords: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    }),
    create: zod_1.z.object({
        name: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }),
        keywords: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }),
    })
};
exports.productSchemas = {
    update: zod_1.z.object({
        name: zod_1.z.string().min(4, { message: "Product name cannot be less than 4 characters." }).max(500, { message: "Product name cannot be more that 500 characters." }).optional(),
        description: zod_1.z.string().min(20, { message: "Product name cannot be less than 20 characters." }).max(1500, { message: "Product name cannot be more that 1500 characters." }).optional(),
        picture: zod_1.z.string().url().optional(),
        price: zod_1.z.number().gt(0, { message: "Price cannot be 0." }).optional(),
        quantity: zod_1.z.number().optional(),
        categoryId: zod_1.z.number().optional(),
        brandId: zod_1.z.number().optional()
    }),
    create: zod_1.z.object({
        name: zod_1.z.string().min(4, { message: "Product name cannot be less than 4 characters." }).max(500, { message: "Product name cannot be more that 500 characters." }),
        description: zod_1.z.string().min(20, { message: "Product name cannot be less than 20 characters." }).max(1500, { message: "Product name cannot be more that 1500 characters." }),
        picture: zod_1.z.string().url(),
        price: zod_1.z.number().gt(0, { message: "Price cannot be 0." }),
        quantity: zod_1.z.number().nullable(),
        categoryId: zod_1.z.number(),
        brandId: zod_1.z.number()
    })
};
exports.productPictureSchema = {
    create: zod_1.z.object({
        url: zod_1.z.string().url()
    }),
    update: zod_1.z.object({
        url: zod_1.z.string().url()
    })
};
exports.userSchema = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }),
        username: zod_1.z.string().min(3, { message: "Username cannot be less than 1 characters." }),
        email: zod_1.z.string().email({ message: "Invalid Email." }),
        password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
        phone: zod_1.z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }),
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
        username: zod_1.z.string().min(3, { message: "Username cannot be less than 1 characters." }).optional(),
        email: zod_1.z.string().email({ message: "Invalid Email." }).optional(),
        password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
        phone: zod_1.z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }).optional(),
    }),
};
