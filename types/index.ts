export type AppStatus = "running" | "maintanence"
export type FindByField = "email" | "id" | "username"

export type TAdmin = {
  id: number,
  name: string,
  phone: string,
  email: string,
  createdAt: Date,
  updatedAt: Date
}