import express from "express"

const usersRouter = express.Router()
usersRouter.get('/users', (req, res, next) => {
  return res.send('Hello users')
})

usersRouter.get('/users/get', (req, res, next) => {
  return res.send('get users')
})

export default usersRouter