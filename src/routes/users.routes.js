const { Router } = require('express')
const usersRouter = Router()

const UsersController = require('../controllers/UsersController')
const usersController = new UsersController()

usersRouter.get('/', usersController.index)
usersRouter.post('/', usersController.create)
usersRouter.get('/:user_id', usersController.show)
usersRouter.put('/:user_id', usersController.update)
usersRouter.delete('/:user_id', usersController.delete)

module.exports = usersRouter