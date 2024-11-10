import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import SendMessage from '../components/SendMessage'
import ChatBox from '../components/ChatBox'

const Chat = ({ socket }) => {
  const location = useLocation()
  const { userName, room } = location.state || {}

  return (
    <div className='flex h-screen w-full bg-slate-800'>
      <Sidebar socket={socket} userName={userName} room={room} />
      <div className='flex flex-col h-screen w-full'>
        <ChatBox socket={socket} userName={userName} room={room} />
        <SendMessage socket={socket} userName={userName} room={room} />
      </div>

    </div>
  )
}

export default Chat