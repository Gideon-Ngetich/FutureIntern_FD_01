const express = require('express')
const dotenv = require('dotenv')
dotenv.config()
const mongoose = require('mongoose')
const userRegistration = require('./routes/auth.route')
const userLogin = require('./routes/login.route')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const { truncate } = require('fs/promises')
const { Chats } = require('./models/chats')
const Chat = require('./models/chats')
const { resolve } = require('path')
const { rejects } = require('assert')

const app = express()
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: truncate
}))
const server = http.createServer(app)
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
})

mongoose.connect(process.env.DB_URL)
    .then(() => {
        console.log('Connected to DB')
    })
    .catch((err) => {
        console.error(err)
    })

const CHAT_BOT = 'ChatBot'
let chatRoom = ''
let allUsers = []

function leaveRoom(userId, chatRoomUsers) {
    return chatRoomUsers.filter((user) => user.id != userId)
}
io.on('connection', (socket) => {
    console.log('A user connected', socket.id);

    socket.on('join_room', async (data) => {
        const { userName, room } = data
        // console.log(data)
        socket.join(room)

        let __createdtime__ = Date.now();

        socket.to(room).emit('receive_message', {
            message: `${userName} has joined the room`,
            userName: CHAT_BOT,
            __createdtime__
        })

        socket.emit('receive_message', {
            message: `Welcome ${userName}`,
            userName: CHAT_BOT,
            __createdtime__
        })

        chatRoom = room;
        allUsers.push({ id: socket.id, userName, room })
        chatRoomUsers = allUsers.filter((user) => user.room === room)
        socket.to(room).emit('chatroom_users', chatRoomUsers)
        socket.emit('chatroom_users', chatRoomUsers)

        return new Promise(async (resolve, reject) => {
            try {
                console.log(room)
                const roomChats = await Chats.find({ room })
                    .sort({ timestamp: 1 })
                    .limit(100)
                    .exec()
                console.log(roomChats)
                socket.emit('last_100_messages', JSON.stringify(roomChats))
                resolve()
            } catch (err) {
                reject(err)
            }
        })
    })

    socket.on('send_message', async (data) => {
        const { userName, room, message, __createdtime__ } = data
        io.in(room).emit('receive_Message', data);

        await new Chats({ userName, room, message, timeStamp: __createdtime__ }).save()

    })

    socket.on('leave_room', (data) => {
        const { userName, room } = data;
        socket.leave(room);
        const __createdtime__ = Date.now();

        allUsers = leaveRoom(socket.id, allUsers)
        socket.to(room).emit('chatroom_users', allUsers)
        socket.to(room).emit('receive_message', {
            message: `${userName} has left the room`,
            __createdtime__
        })
        console.log(`${userName} has left the room`)
    })

    socket.on('disconnect', () => {
        console.log('User disconnected from the chat')
        const user = allUsers.find((user) => user.id == socket.id);
        if (user?.userName) {
            allUsers = leaveRoom(socket.id, allUsers);
            socket.to(chatRoom).emit('chatroom_users', allUsers);
            socket.to(chatRoom).emit('receive_message', {
                message: `${user.userName} has disconnected from the chat.`
            })
        }
    })

})

server.listen(4000, () => {
    console.log('Server running on port 4000')
})

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`)
})

app.get('/', (req, res) => {
    return res.status(234).send('Welcome to my app')
})

app.use('/api/userregistration', userRegistration)
app.use('/api/userlogin', userLogin)