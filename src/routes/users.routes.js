const { Router } = require('express')
const usersRouter = Router()

const UsersController = require('../controllers/UsersController')
const usersController = new UsersController()

usersRouter.get('/:user_id', usersController.show)

module.exports = usersRouter