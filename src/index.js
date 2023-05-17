const express = require('express')
const logger = require('morgan')
require('dotenv').config()

const PORT = process.env.PORT || 8000

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.listen(PORT,()=>{
  console.log(`server running on port ${PORT}`)
})



