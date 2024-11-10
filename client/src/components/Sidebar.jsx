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
    <div className='flex flex-col justify-start items-start w-1/4 bg-slate-400'>
        <h2 className='font-semibold text-2xl py-3 bg-blue-700 w-full text-white px-4'>{room} Group</h2>

        <div>
            {roomUsers.length > 0 && <h5 className='font-medium p-5 w-full text-xl text-center'>Active Users</h5>}

            <ul className='px-5'>
                {roomUsers.map((user) => (
                    <li key={user.id} className='text-md font-medium '>{user.userName}</li>
                ))}
            </ul>
        </div>

        <div className='flex justify-center items-center w-full py-20'>
            <button onClick={leaveRoom} className='px-6 py-3 bg-rose-600 rounded-md'>Leave Room</button>
        </div>
    </div>
  )
}

export default Sidebar