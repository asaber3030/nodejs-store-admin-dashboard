import express from "express"
import dotenv from "dotenv"

import { showAppURLCMD } from "../utlis/helpers"
import { adminRouter, usersAuthRouter, adminDataRouter, ordersRouter, categoriesRouter, couponsRouter, productsRouter, usersRouter, brandsRouter } from "../routes"

dotenv.config()

const app = express()
const port = process.env.APP_PORT

app.use(express.json())
app.use("/api/v1", [usersAuthRouter, adminRouter, adminDataRouter, productsRouter, usersRouter, ordersRouter, brandsRouter, couponsRouter, categoriesRouter])

app.get("/", async (req, res) => {
  return res.status(200).json({
    message: "Welcome to admin store admin dashboard",
    info: "To start using the api head to this route: /api/v1/login",
    status: 200,
  })
})

app.listen(port, () => {
  showAppURLCMD(port!)
})

export default app
