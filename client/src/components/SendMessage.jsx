import React, {useState} from 'react'

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
    <div>
        <input type="text" placeholder='Message' value={message} onChange={(e) => setMessage(e.target.value)} />

        <button onClick={sendMessage}>Send</button>
    </div>
  )
}

export default SendMessage