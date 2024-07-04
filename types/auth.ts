import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email({
    message: "Email is required."
  }),
  password: z.string()
})

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be less than 1 characters." }),
  email: z.string().email({ message: "Invalid Email." }),
  password: z.string().min(8, { message: "Password cannot be less than 8 characters." }),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }),
})

export const updateAdminSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
  email: z.string().email({ message: "Invalid Email." }).optional(),
  password: z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
  phone: z.string().regex(/^01[0-2,5]{1}[0-9]{8}$/, { message: "Invaliad Egyptian Phone Number format - 01x xxxx xxxx" }).optional(),
})