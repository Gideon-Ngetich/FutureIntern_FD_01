import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom'


const Sidebar = ({socket, userName, room}) => {
    const [roomUsers, setRoomUsers] = useState([])

    const navigate = useNavigate();

    useEffect(() => {
        socket.on('chatroom_users', (data) => {
            console.log({'room users': data})
            setRoomUsers(data);
        })

        return () => socket.off('chatroom_users')
    }, [socket])

    const leaveRoom = () => {
        const __createdtime__ = Date.now()
        socket.emit('leave_room', {userName, room, __createdtime__})
        navigate('/', {replace: true})
    }
  return (
    <div>
        <h2>{room}</h2>

        <div>
            {roomUsers.length > 0 && <h5>Users</h5>}

            <ul>
                {roomUsers.map((user) => (
                    <li key={user.id}>{user.userName}</li>
                ))}
            </ul>
        </div>

        <div>
            <button onClick={leaveRoom}>Leave Room</button>
        </div>
    </div>
  )
}

export default Sidebar