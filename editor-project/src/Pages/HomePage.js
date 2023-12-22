import React, { useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import logo from '../Assets/logo.png'
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast'
function HomePage() {

    const [roomId, setRoomId] = useState('')
    const [username, setUsername] = useState('')
    const navigate = useNavigate()
    const createNewRoom = (e) => {
        e.preventDefault()
        const id = uuidv4()
        setRoomId(id);
        toast.success('Created a new room')
    }

    const joinRoom = ()=>{
        if(!roomId || !username){
            toast.error("Room ID ans username required")
            return
        }

        navigate(`/editor/${roomId}`,{
            state:{
                username
            }
        })
    }

    return (
        <div className="homewrapper">
            <div className="formwrapper">
                <img src={logo} alt="" style={{ width: '50px', height: '50px', borderRadius: '50%', backgroundColor: "white" }} />
                <h4 className="label">Enter you room ID here: </h4>
                <div className="input">
                    <input className='inputBox' type="text" value={roomId} onChange={(e) => setRoomId(e.target.value)} placeholder='Room ID' />
                    <input className='inputBox' type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
                    <button className="btn" onClick={joinRoom}>Join</button>
                    <span className="create">
                        If you dont have an account click here &nbsp;
                        <a href="" className='createBtn' onClick={createNewRoom}>new room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>Welcome to the Editor</h4>
            </footer>
        </div>
    )
}

export default HomePage