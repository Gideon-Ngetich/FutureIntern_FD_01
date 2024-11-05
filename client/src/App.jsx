import Chat from "./pages/Chat"
import Login from "./pages/Login"
import { Routes, Route} from 'react-router-dom'
import io from 'socket.io-client'

function App() {
 const socket = io.connect('http://localhost:4000')
  return (
    <>
      <Routes>
        <Route path="/" element={<Login socket={socket}/>} />
        <Route path="/chat" element={<Chat socket={socket}/>} />
      </Routes>
    </>
  )
}

export default App
