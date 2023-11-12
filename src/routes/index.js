const {Router} = require('express')

//Rotas
const usersRoutes = require('./users.routes.js')
const movieNotesRoutes = require('./notes.routes.js')
// const movieTagsRoutes = require('./tags.routes.js/index.js')

const routes = Router()

routes.use("/Users", usersRoutes)
routes.use("/Notes", movieNotesRoutes)
// routes.use("/Tags", movieTagsRoutes)


module.exports = routes;