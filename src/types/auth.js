"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateAdminSchema = exports.registerSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email({
        message: "Email is required."
    }),
    password: zod_1.z.string()
});
exports.registerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }),
    email: zod_1.z.string().email({ message: "Invalid Email." }),
    password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
    phone: zod_1.z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }),
});
exports.updateAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
    email: zod_1.z.string().email({ message: "Invalid Email." }).optional(),
    password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
    phone: zod_1.z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }).optional(),
});
