import React, { useState, useEffect } from 'react'
import { Button, Checkbox, Label, TextInput } from "flowbite-react";
import axios from 'axios'
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';

const Login = ({socket}) => {

    const [email, setEmail] = useState('')
    const [room, setRoom] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()



    const handleEmailChange = (e) => {
        setEmail(e.target.value)
    }

    const handleRoomChange = (e) => {
        setRoom(e.target.value)
    }

    const handlePasswordChange = (e) => {
        setPassword(e.target.value)
    }

   
    const handleSubmit = async (e) => {
        try {

            e.preventDefault();

            const response = await axios.post('http://localhost:3000/api/userlogin', { email, password })

            if (response.status === 200) {
                const data = response.data
                console.log('login successfull')
                const userName = data.userName

                socket.emit('join_room', {room, userName})
                navigate('/chat',{ state: { userName, room }, replace: true})
            }

        } catch (err) {
            if (err.response && err.response.status === 401) {
                console.log('Wrong email or password')
            }
            else {
                console.error(err)
            }
        }
    }

    return (
        <div className='flex flex-col justify-center items-center w-full p-10'>
            <div className='text-2xl font-bold p-5'>Chat Room</div>
            <form className="flex flex-col gap-4 w-1/2">
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="email1" value="Your email" />
                    </div>
                    <TextInput id="email1" type="email" placeholder="name@flowbite.com" value={email} onChange={handleEmailChange} required />
                </div>
                <div>
                    <div className="mb-2 block">
                        <Label htmlFor="password1" value="Your password" />
                    </div>
                    <TextInput id="password1" type="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <div>
                    <div>Room</div>
                    <select name="" id="" value={room} onChange={handleRoomChange} required>
                        <option value='' defaultValue={true}>--Select Room--</option>
                        <option value='React'>React</option>
                        <option value="Vue">Vue</option>
                    </select>

                </div>
                <Button onClick={handleSubmit} type="submit">Join Room</Button>
            </form>
        </div>
    )
}

export default Login