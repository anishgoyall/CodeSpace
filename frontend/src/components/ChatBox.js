import React from "react";
import Avatar from 'react-avatar';

function ChatBox({ message, setMessage, messages, handleMessageSend }) {
    return (
        <div className="flex flex-col justify-end h-[80vh] w-[27vw] fixed right-2 top-12 p-6 bg-gray-100 rounded-md">
            <div className="flex flex-col space-y-2 overflow-y-scroll">
                {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === "user" ? "justify-end self-end" : "justify-start"}`}>
                        {message.type === "user" ? (
                            <div className="max-w-[15vw] break-all px-4 py-2 bg-blue-500 text-white rounded-md">
                                {message.text}
                            </div>
                        ) : (
                            <div className="flex space-x-2">
                                <Avatar name={message.user} color='gray' size="30" textSizeRatio={3} round={true} />
                                <div className="flex flex-col sapce-y-1 max-w-[15vw] break-all px-4 py-2 bg-teal-500 text-white rounded-md">
                                    <span className="text-sm font-semibold capitalize text-gray-800">{message.user}</span>
                                    <span>{message.text}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex space-x-2 mt-4">
                <input
                    type="text"
                    className="flex-grow border border-gray-300 p-2 rounded-lg"
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                    type="button"
                    onClick={handleMessageSend}
                >
                    Send
                </button>
            </div>
        </div>
    );
}

export default ChatBox;
