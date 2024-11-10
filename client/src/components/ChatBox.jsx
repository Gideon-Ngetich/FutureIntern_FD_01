import React, { useState, useRef, useEffect } from 'react'

const ChatBox = ({ socket, userName, room }) => {

    const [receivedMessages, setReceivedMessages] = useState([])

    const messageColRef = useRef(null)

    useEffect(() => {
        socket.on('receive_message', (data) => {
            console.log(data);
            setReceivedMessages((state) => [
                ...state, {
                    message: data.message,
                    userName: data.userName,
                    __createdtime__: data.__createdtime__
                }
            ])
            console.log(__createdtime__)
        })

        return () => socket.off('receive_message')
    }, [socket])

    useEffect(() => {
        const handleLast100Messages = (last100Messages) => {
            const parsedMessages = JSON.parse(last100Messages);

            const sortedMessages = sortMessagesByDate(parsedMessages)

            setReceivedMessages((prevState) => [...sortedMessages, ...prevState])
        }

        socket.on('last_100_messages', handleLast100Messages)

        return () => socket.off('last_100_messages')
    }, [socket])

    // useEffect(() => {
    //     messageColRef.current.scrollTop =
    //         messageColRef.current.scrollHeight;
    // }, [receivedMessages]);

    function sortMessagesByDate(messages) {
        return messages.sort(
            (a, b) => parseInt(a.__createdtime__) - parseInt(b.__createdtime__)
        );
    }

    function formatDateFromTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleString();
    }

    return (
        <div className='bg-slate-800 overflow-y-scroll px-10'>
            {receivedMessages.map((msg, i) => (
                <div key={i} className=''>
                    <div className='bg-slate-600 my-2 w-1/4 rounded-lg px-5'>
                        <div className='flex justify-between w-full'>
                            <div className='w-full text-slate-300'>{msg.userName}</div>
                            <span className='w-full'>{msg.__createdtime__}</span>
                        </div>
                        <p className='w-full text-lg h-12 text-white'>{msg.message}</p>
                    </div>

                </div>
            ))}
        </div>
    )
}

export default ChatBox