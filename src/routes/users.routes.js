const { Router } = require('express')
const usersRouter = Router()

const UsersController = require('../controllers/UsersController')
const usersController = new UsersController()

usersRouter.post('/', usersController.create)
usersRouter.get('/:user_id', usersController.show)
usersRouter.put('/:user_id', usersController.update)
usersRouter.delete('/:user_id', usersController.delete)
usersRouter.get('/', usersController.index)

module.exports = usersRouter