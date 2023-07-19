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

const golangCode =
    `package main
import "fmt"

func main() {
    fmt.Println("CodeSpace")
}`

const csharpCode =
    `using System;

class Program {
    static void Main() {
        Console.WriteLine("CodeSpace");
    }
}
`

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
            if (language === 'cpp') setCode(cppCode);
            if (language === 'python') setCode(pythonCode);
            if (language === 'java') setCode(javaCode);
            if (language === 'go') setCode(golangCode);
            if (language === 'c#') setCode(csharpCode);
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
        if (language === 'cpp') setCode(cppCode);
        if (language === 'python') setCode(pythonCode);
        if (language === 'java') setCode(javaCode);
        if (language === 'go') setCode(golangCode);
        if (language === 'c#') setCode(csharpCode);

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

        let codeLanguage;
        if (language === 'cpp') codeLanguage = 'c_cpp';
        if (language === 'python') codeLanguage = 'python';
        if (language === 'java') codeLanguage = 'java';
        if (language === 'go') codeLanguage = 'golang';
        if (language === 'c#') codeLanguage = 'csharp';

        const options = {
            method: 'POST',
            url: 'https://code-compiler10.p.rapidapi.com/',
            headers: {
                'content-type': 'application/json',
                'x-compile': 'rapidapi',
                'Content-Type': 'application/json',
                'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_JUDGE,
                'X-RapidAPI-Host': 'code-compiler10.p.rapidapi.com'
            },
            data: {
                langEnum: [
                    'php',
                    'python',
                    'c',
                    'c_cpp',
                    'csharp',
                    'kotlin',
                    'golang',
                    'r',
                    'java',
                    'typescript',
                    'nodejs',
                    'ruby',
                    'perl',
                    'swift',
                    'fortran',
                    'bash'
                ],
                lang: codeLanguage,
                code: code,
                input: input
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            if (response.data.output !== "") {
                setOutput(response.data.output);
                socket.emit("OUTPUT-CHANGE", response.data.output);
            }
            else {
                setOutput("Error");
                socket.emit("OUTPUT-CHANGE", "Error");
            }
        } catch (error) {
            console.error(error);
            setOutput("Error");
            socket.emit("OUTPUT-CHANGE", "Error");
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