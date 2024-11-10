import React, {useState} from 'react'
import { IoMdSend } from "react-icons/io";

const SendMessage = ({socket, userName, room}) => {
    
    const [message, setMessage] = useState('')

    const sendMessage = () => {
        if(message !== ''){
            const __createdtime__ = Date.now();

            socket.emit('send_message', {userName, room, message, __createdtime__})
            console.log(message)
            setMessage('')
        }
    }
  return (
    <div className='w-1/2 flex gap-3 px-10 bg-slate-800 py-5'>
        <input className='w-full rounded-lg' type="text" placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={sendMessage} className='text-2xl text-white'><IoMdSend /></button>
    </div>
  )
}

export default SendMessage