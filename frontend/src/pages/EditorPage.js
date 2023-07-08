import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CodeEditor from '../components/CodeEditor';
import InputOutput from '../components/InputOutput';
import toast from 'react-hot-toast';
import { FaRegCopy } from 'react-icons/fa';
import { ImEnter } from 'react-icons/im';
import { MdExitToApp } from 'react-icons/md';
import { FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import ReactLoading from 'react-loading';
import io from "socket.io-client";
import axios from 'axios';

const cCode =
    `#include <stdio.h>

int main() {
    printf("CodeSpace");
    return 0;
}`

const cppCode =
    `#include <bits/stdc++.h>
using namespace std;

int main() {
  cout << "CodeSpace";
  return 0;
}`

const pythonCode = `print("CodeSpace")`

const javaCode =
    `public class Main{
        public static void main(String[] args) {
            System.out.println("CodeSpace");
        }
}`

const startingCode = cppCode;

function EditorPage() {
    const navigate = useNavigate();
    const [socket, setSocket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currUser, setcurrUser] = useState("");
    const [users, setUsers] = useState('');
    const [code, setCode] = useState(startingCode);
    const [language, setLanguage] = useState("cpp");
    const [theme, setTheme] = useState("vs-dark");
    const [input, setInput] = useState('');
    const [output, setOutput] = useState();
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_BACKEND_URL);
        setSocket(newSocket);

        const username = localStorage.getItem('username');
        const roomId = localStorage.getItem('roomId');
        setcurrUser(username);

        setTimeout(() => {
            setLoading(false);
        }, 1000);

        newSocket.emit("JOIN", {
            roomId,
            username,
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;
        socket.on("CODE-CHANGE", (code) => {
            setCode(code);
        });

        socket.on("LANGUAGE-CHANGE", (language) => {
            setLanguage(language);
            if (language === 'c') setCode(cCode)
            if (language === 'cpp') setCode(cppCode)
            if (language === 'python') setCode(pythonCode)
            if (language === 'java') setCode(javaCode)
        });

        socket.on("THEME-CHANGE", (theme) => {
            setTheme(theme);
        });

        socket.on("INPUT-CHANGE", (input) => {
            setInput(input);
        });

        socket.on("OUTPUT-CHANGE", (output) => {
            setOutput(output);
        });

        socket.on("MESSAGE-CHANGE", ({ message, currUser }) => {
            setMessages((messages) => [...messages,
            { type: 'other', user: currUser, text: message }
            ]);
        });

        socket.on("ROOM-DATA-CHANGE", ({ users }) => {
            setUsers(users);
        });

        socket.on("TOAST-NOTIFICATION", ({ text, type }) => {
            if (type === "Join") {
                toast(text, {
                    icon: <ImEnter />,
                });
            }
            if (type === "Leave") {
                toast(text, {
                    icon: <MdExitToApp />,
                });
            }
            if (type === "Message") {
                toast(text, {
                    icon: <FiMessageSquare />,
                });
            }
        });

        window.addEventListener("popstate", () => {
            socket.disconnect();
        });

        return () => {
            socket.disconnect();
            socket.off("CODE-CHANGE", "LANGUAGE-CHANGE", "THEME-CHANGE", "INPUT-CHANGE", "OUTPUT-CHANGE", "MESSAGE-CHANGE", "ROOM-DATA-CHANGE", "TOAST-NOTIFICATION");
        }

    }, [socket]);

    const handleCodeChange = (code) => {
        setCode(code);
        socket.emit("CODE-CHANGE", code);
    };

    const handleLanguageChange = (language) => {
        setLanguage(language);
        if (language === 'c') setCode(cCode)
        if (language === 'cpp') setCode(cppCode)
        if (language === 'python') setCode(pythonCode)
        if (language === 'java') setCode(javaCode)
        socket.emit("LANGUAGE-CHANGE", language);
    };

    const handleThemeChange = (theme) => {
        setTheme(theme);
        socket.emit("THEME-CHANGE", theme);
    };

    const handleCopyRoomId = () => {
        const roomId = localStorage.getItem('roomId');
        navigator.clipboard.writeText(roomId);
        toast.success('Room ID copied to clipboard !', {
            icon: <FaRegCopy />,
        });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard !', {
            icon: <FaRegCopy />,
        });
    };

    const handleInputChange = (input) => {
        setInput(input);
        socket.emit("INPUT-CHANGE", input);
    };

    const handleCodeRun = async () => {
        setOutput('Running...');
        socket.emit("OUTPUT-CHANGE", 'Running...');

        const headers = {
            'content-type': 'application/json',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'x-rapidapi-key': process.env.REACT_APP_RAPID_API_JUDGE
        };

        let id;
        if (language === 'python') id = 71;
        if (language === 'c') id = 50;
        if (language === 'cpp') id = 54;
        if (language === 'java') id = 62;

        const data = {
            source_code: code,
            language_id: id,
            stdin: input
        };

        try {
            let responseToken;
            await axios.post('https://judge0-ce.p.rapidapi.com/submissions', data, { headers })
                .then(response => {
                    console.log(response.data);
                    responseToken = response.data.token;
                })
                .catch(error => {
                    console.log(error);
                    setOutput(error);
                    socket.emit("OUTPUT-CHANGE", error);
                });

            await axios.get(`https://judge0-ce.p.rapidapi.com/submissions/${responseToken}`, { headers })
                .then(response => {
                    if (response.data.stdout !== null) setOutput(response.data.stdout);
                    else setOutput('Error');
                    socket.emit("OUTPUT-CHANGE", response.data.stdout);
                })
                .catch(error => {
                    setOutput(error);
                    socket.emit("OUTPUT-CHANGE", error.data.stdout);
                });
        }
        catch (error) {
            setOutput(error);
            socket.emit("OUTPUT-CHANGE", error.data.stdout);
        }
    };

    const handleMessageSend = () => {
        if (message === '') return;
        setMessages((messages) => [...messages,
        { type: 'user', user: currUser, text: message }
        ]);
        socket.emit("MESSAGE-CHANGE", { message, currUser });
        setMessage("");
    };

    const handleLeave = () => {
        socket.emit("ROOM-LEAVE");
        navigate(`/`);
    }

    return (
        <>
            {loading ?
                <div className='flex h-screen justify-center items-center bg-zinc-700'>
                    <ReactLoading type='bars' color='gray' />
                </div>
                :
                <div className='flex h-screen bg-zinc-700'>
                    <Sidebar users={users} handleCopyRoomId={handleCopyRoomId} handleLeave={handleLeave} message={message}
                        setMessage={setMessage} messages={messages} handleMessageSend={handleMessageSend} />
                    <CodeEditor
                        language={language} theme={theme} startingCode={startingCode} code={code} handleLanguageChange={handleLanguageChange}
                        handleThemeChange={handleThemeChange} handleCodeChange={handleCodeChange} handleCopyCode={handleCopyCode} handleCodeRun={handleCodeRun}
                    />
                    <InputOutput theme={theme} input={input} output={output} handleInputChange={handleInputChange} />
                </div >
            }
        </>
    )
}

export default EditorPage;