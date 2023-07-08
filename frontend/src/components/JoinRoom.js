import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

export default function JoinRoom({ closePopup }) {
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const onJoinRoom = (e) => {
        if (!roomId || !username) {
            toast.error('Username or RoomID cannot be NULL');
            return;
        }
        localStorage.setItem('roomId', roomId);
        localStorage.setItem('username', username);
        navigate(`/editor/${roomId}`);
    }

    return (
        <>
            <div className='flex flex-col space-y-4 relative h-64 w-80 p-8 bg-white border rounded'>
                <h1 className='text-2xl text-center font-bold mb-2'>Join a&nbsp;
                    <span className='font-bold'>Code
                        <span className='text-yellow-400'>Room</span>
                    </span>
                </h1>
                <div className='absolute -top-2 right-4' onClick={closePopup}><FontAwesomeIcon icon={faXmark} /></div>

                <label className='flex flex-col space-y-1'>
                    <h1>Enter Your Name <span className='text-red-700'>*</span></h1>
                    <input
                        type="text"
                        placeholder='Your Name'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && onJoinRoom()}
                        className='text-gray-500 text-sm px-2 py-1 outline-none rounded border border-solid border-blue-500'
                    />
                </label>
                <label className='flex flex-col space-y-1 text-sm'>
                    <h1>Enter Room Id <span className='text-red-700'>*</span></h1>
                    <input
                        type="text"
                        placeholder='xxxx-xxxx-xxxx'
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && onJoinRoom()}
                        className='text-gray-500 text-sm px-2 py-1 outline-none rounded border border-solid border-blue-500'
                    />
                </label>
                <button type='button' className='bg-yellow-400 hover:bg-yellow-500 
                     text-sm absolute -bottom-4 px-4 py-1.5 rounded' onClick={onJoinRoom}>Join Room</button>
            </div>
        </>
    )
}
