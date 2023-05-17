const express = require('express')
const logger = require('morgan')
const mongoose = require('mongoose')
require('dotenv').config()

const PORT = process.env.PORT || 8000;
const DATABASE_URL = process.env.DATABASE_URL

const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true}))





main().then(()=>{
  app.listen(PORT,()=>{
    console.log(`server running on port ${PORT}`)
  })
}).catch(error=>{
  console.log(error)
})


async function main(){
 await mongoose.connect(DATABASE_URL)
}


