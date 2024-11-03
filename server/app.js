const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const userRegistration = require('./routes/auth.route')
const userLogin = require('./routes/login.route')


const app = express()
app.use(express.json())


mongoose.connect(process.env.DB_URL)
.then(() => {
    console.log('Connected to DB')
})
.catch((err) => {
    console.error(err)
})

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`)
})

app.get('/', (req,res) => {
    return res.status(234).send('Welcome to my app')
})

app.use('/api/userregistration', userRegistration)
app.use('/api/userlogin', userLogin)