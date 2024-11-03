const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const joi = require('joi')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})

const validate = (data) => {
    const schema = joi.object({
        userName: joi.string().label('UserName'),
        email: joi.string().label('email'),
        password: joi.string().label('password')
    })
    return schema.validate(data)
}

const User = mongoose.model('accounts', userSchema)
module.exports = {User, validate};