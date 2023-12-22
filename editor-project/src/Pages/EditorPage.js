import React, { useEffect, useRef, useState } from 'react'
import logo from '../Assets/logo.png'
import Client from '../Components/Client'
import { useLocation } from 'react-router-dom'
import EditorNew from '../Components/EditorNew'
import { useNavigate, Navigate, useParams } from 'react-router-dom'
import { initSocket } from '../socket'
import ACTIONS from '../Actions'
import toast from 'react-hot-toast'
import Editor from '../Components/Editor'
function EditorPage() {
  const socketRef = useRef(null)
  const codeRef = useRef(null)
  const location = useLocation()
  const navigate = useNavigate()
  const { roomId } = useParams()
  // console.log(params);
  const [clients, setClients] = useState([])
  useEffect(() => {
    const init = async () => {

      const handleErrors = (e) => {
        console.log('Socket error', e);
        toast.error("Socket connection failed, please try again later");

      }

      socketRef.current = await initSocket()
      socketRef.current.on('connection_error', (err) => handleErrors(err))
      socketRef.current.on('connection_failed', (err) => handleErrors(err))
      socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username
      });

      //Listening for joined event
      socketRef.current.on(ACTIONS.JOINED, ({ clients, username, socketId }) => {
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room `)
          console.log(`${username} joined`);
        }
        setClients(clients)
        socketRef.current.emit(ACTIONS.SYNC_CODE,{
          code: codeRef.current,
          socketId
        })
      })

      //Listening for disconnected
      socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
        toast.success(`${username} left the room`)
        setClients((prev) => {
          return prev.filter(client => client.socketId !== socketId)
        })
      })
    }
    init()
    return () => {
      socketRef.current.off(ACTIONS.JOINED)
      socketRef.current.off(ACTIONS.DISCONNECTED)
      socketRef.current.disconnect()
    }
  }, [])


  const handleLeaveRoom = () => {
    socketRef.current.emit(ACTIONS.LEAVE, {
      roomId,
      username: location.state?.username,
    });
    navigate('/');
  };

  const handleCopyRoomId = () => {
    const roomIdToCopy = roomId || '';
    navigator.clipboard.writeText(roomIdToCopy).then(() => {
      toast.success('Room ID copied to clipboard');
    });
  };
  if (!location.state) {
    return <Navigate to='/'></Navigate>
  }

  return (
    <div className='mainwrap'>
      <div className="sidebar">
        <div className="inner">
          <img src={logo} height={60} width={60} className='logo' alt="" />
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map((client) => (
                <Client username={client.username} key={client.socketId} />
              ))
            }
          </div>
        </div>
        <button className=' btn copyBtn' onClick={handleCopyRoomId}>copy Room ID</button>
        <button className='btn leaveBtn' onClick={handleLeaveRoom}>Leave room</button>
      </div>
      <div className="editorwrap">
        <Editor socketRef={socketRef} roomId={roomId} onCodeChange={(code)=>{
          codeRef.current=code
        }}></Editor>
      </div>
    </div>
  )
}

export default EditorPage