import { SafeParseReturnType } from "zod"
import { Request } from "express"

export function showAppURLCMD(port: string) {
  console.log(`Server running at PORT: http://localhost:${port}`)
}

export function extractErrors<T>(errors: SafeParseReturnType<T, T>) {
  return errors.error?.flatten().fieldErrors
}

export function extractToken(authorizationHeader: string) {
  if (authorizationHeader) {
    const splitted = authorizationHeader.split(' ')
    if (splitted[1]) return splitted[1]
  }
  return ''
}

export function createPagination(req: Request) {
  
  const page = req.query.page ? +req.query.page : 0
  const limit = req.query.limit ? +req.query.limit : TAKE_LIMIT
  const orderBy = req.query.orderBy ?? 'id' 
  const orderType = req.query.orderType ?? 'desc'

  const skip = page * limit

  return {
    orderBy: orderBy as string, 
    orderType: orderType as string, 
    skip, 
    limit,
    page
  }
}

export function generateOrderId(min = 999, max = 9999) {
  min = Math.ceil(min);
  max = Math.floor(max);
  
  const num1 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num2 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num3 =  Math.floor(Math.random() * (max - min + 1)) + min;
  const num4 =  Math.floor(Math.random() * (max - min + 1)) + min;

  return num1.toString().padStart(4, "0") + '-' + num2.toString().padStart(4, "0") + '-' + num3.toString().padStart(4, "0") + '-' + num4.toString().padStart(4, "0")
}

export const TAKE_LIMIT = 10