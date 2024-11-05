const mongoose = require('mongoose')

const chatsSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true
    },
    room:{
        type: String,
        required: true
    },
    timeStamp: {
        type: Number,
    }

})

const Chats = mongoose.model('chats', chatsSchema)

module.exports = {Chats};