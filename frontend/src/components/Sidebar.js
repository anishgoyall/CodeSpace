import React from 'react';
import Popup from 'reactjs-popup';
import UserList from '../components/UserList';
import ChatBox from '../components/ChatBox';
import { confirm } from "react-confirm-box";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCircleChevronLeft, faCode, faUserGroup, } from '@fortawesome/free-solid-svg-icons';
import { BsChatSquareText } from 'react-icons/bs';

function Sidebar({ users, handleCopyRoomId, handleLeave, message, setMessage, messages, handleMessageSend }) {
    const confirmLeave = async () => {
        const result = await confirm("Are you sure to Leave?", {
            labels: {
                confirmable: "Yes",
                cancellable: "No"
            }
        });
        if (result) {
            handleLeave();
            return;
        }
    }

    return (
        <>
            <div className='flex justify-between flex-col pt-2 pb-8 items-center h-[100vh] min-w-[18vw] bg-zinc-900'>
                <div className='flex flex-col space-y-3 items-center'>
                    <div className='flex flex-col space-y-1 items-center m-4 mb-6'>
                        <h1 className='flex items-center text-xl text-white font-bold'>
                            <FontAwesomeIcon icon={faCode} color='#C5C5C5' /> &nbsp;
                            <span className='font-bold text-gray-300'>Code</span>
                            <span className='text-yellow-400'>Space</span> &nbsp;
                            <FontAwesomeIcon icon={faCode} color='#C5C5C5' />
                        </h1>
                        <h1 className='text-pink-400 text-xs'>A Real-Time Code Editor</h1>
                    </div>
                    <Popup
                        trigger={<button type='button' className=' hover:bg-zinc-600 bg-zinc-700 text-gray-300
                          font-bold px-4 py-2 rounded'><FontAwesomeIcon icon={faUserGroup} /> 
                            Participants [ {users.length === 0 ? 1 : users.length} ]
                            </button>
                            }
                        position={'bottom center'}
                    >
                        <UserList users={users} />
                    </Popup>
                    <button type='button' onClick={handleCopyRoomId} className='hover:bg-zinc-600 bg-zinc-700 text-gray-300 
                     font-bold px-8 py-2 rounded'><FontAwesomeIcon icon={faCopy} /> Room ID</button>
                    <Popup
                        trigger={
                            <button type='button' class="flex space-x-1 items-center bg-yellow-500 hover:bg-yellow-600 text-lg font-semibold
                            text-gray-100 px-5 py-2 rounded">
                                <span>Chat</span>
                                <BsChatSquareText />
                            </button>
                        }
                        closeOnDocumentClick
                        arrow={false}
                    >
                        <ChatBox message={message} setMessage={setMessage} messages={messages} handleMessageSend={handleMessageSend} />
                    </Popup>
                </div>
                <button type='button' onClick={confirmLeave} className='bg-red-600 hover:bg-red-700 text-lg font-bold
                     text-gray-300 px-8 py-2 rounded'><FontAwesomeIcon icon={faCircleChevronLeft} /> Leave</button>
            </div>
        </>
    )
}

export default Sidebar;
