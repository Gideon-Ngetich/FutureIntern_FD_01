import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import SendMessage from '../components/SendMessage'
import ChatBox from '../components/ChatBox'

const Chat = ({socket}) => {
    const location = useLocation()
    const { userName, room } = location.state || {}

  return (
    <div>
        <Sidebar socket={socket} userName={userName} room={room}/>
        <SendMessage socket={socket} userName={userName} room={room}/>
        <ChatBox socket={socket} userName={userName} room={room}/>
    </div>
  )
}

export default Chat