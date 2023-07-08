import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faXmark } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuid } from 'uuid';

export default function CreateRoom({ closePopup }) {
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const onCreateRoom = (e) => {
        if (!username) {
            toast.error('Username cannot be NULL');
            return;
        }
        setTimeout(() => {
            toast.success('New Room Created !', {
                icon: <FontAwesomeIcon icon={faHome} />,
            });
        }, 1000);
        const roomId = uuid();
        localStorage.setItem('roomId', roomId);
        localStorage.setItem('username', username);
        navigate(`/editor/${roomId}`);
    }

    return (
        <>
            <div className='flex flex-col space-y-5 relative h-52 w-80 p-8 bg-white border rounded'>
                <h1 className='text-2xl text-center'>Create a&nbsp;
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
                        onKeyPress={(e) => e.key === "Enter" && onCreateRoom()}
                        className='text-gray-500 text-sm px-2 py-1 outline-none rounded border border-solid border-blue-500'
                    />
                </label>
                <button type='button' className='bg-yellow-400 hover:bg-yellow-500 
                  text-sm absolute -bottom-4 px-4 py-1.5 rounded' onClick={onCreateRoom}>Create Room</button>
            </div>
        </>
    )
}
