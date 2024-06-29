import express from "express";
import dotenv from "dotenv";

import { showAppURLCMD } from "./utlis/helpers";
import { authRouter, ordersRouter, categoriesRouter, couponsRouter, productsRouter, usersRouter, brandsRouter } from "./routes";

dotenv.config();

const app = express();
const port = process.env.APP_PORT;

app.use(express.json())
app.use('/api/v1', [
  productsRouter, 
  usersRouter,
  authRouter,
  ordersRouter,
  brandsRouter,
  couponsRouter,
  categoriesRouter,
])

app.listen(port, () => { 
  showAppURLCMD(port!)
})