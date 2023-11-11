require('express-async-errors')
const AppError = require('./utils/AppError')

const express = require('express')
const app = express()


const routes = require('./routes/index.js')
app.use(routes)

app.use(express.json())

app.use((error, req, res, next) => {

    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            status: "error",
            message: error.message
        })
    }

    return response.status(500).json({
        status: "error",
        message: "Erro interno do servidor"
    })

})


const port = 3333
app.listen(port, () => console.log(`app listening on port ${port}!`))