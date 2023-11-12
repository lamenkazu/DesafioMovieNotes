const {Router} = require('express')
const NotesController = require('../controllers/NotesController.js')

const notesController = new NotesController()
const notesRouter = Router()

notesRouter.get('/', notesController.index)
notesRouter.get('/:note_id', notesController.show)
notesRouter.post('/:user_id', notesController.create)
notesRouter.delete('/:note_id', notesController.delete)

module.exports = notesRouter