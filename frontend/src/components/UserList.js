import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserAstronaut } from '@fortawesome/free-solid-svg-icons';

export default function UsersList({ users }) {
    return (
        <div className='flex flex-col space-y-4 relative p-8 bg-white border rounded'>
            {users && users.map((user) => (
                <div className='text-black' key={user.socketId}>
                    <FontAwesomeIcon icon={faUserAstronaut} />
                    &nbsp;&nbsp;
                    {user.username}
                    <div className="h-0.5 bg-gray-300"></div>
                </div>
            ))}
        </div>
    );
}
