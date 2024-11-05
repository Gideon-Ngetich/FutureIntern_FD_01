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
        <div>
            {receivedMessages.map((msg, i) => (
                <div key={i}>
                    <div>
                        <span>{msg.userName}</span>
                        <span>{msg.__createdtime__}</span>
                    </div>
                    <p>{msg.message}</p>
                </div>
            ))}
        </div>
    )
}

export default ChatBox