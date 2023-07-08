import React from 'react';
import Select from 'react-select';
import Editor from '@monaco-editor/react';
import { GoFileCode } from 'react-icons/go';
import { AiFillCaretRight } from 'react-icons/ai';

const languages = [
    { value: "c", label: "C" },
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
];

const themes = [
    { label: 'Dark', value: 'vs-dark' },
    { label: 'Black', value: 'hc-black' },
    { label: 'Light', value: 'vs-light' },
];

function CodeEditor({ language, theme, startingCode, code, handleLanguageChange, handleThemeChange, handleCodeChange, handleCopyCode, handleCodeRun }) {
    return (
        <div className='flex flex-col space-y-3 h-[90vh] w-[50vw] m-7 rounded'>
            <div className='flex space-x-3'>
                <div className='flex flex-col'>
                    <span className='text-white'>Language</span>
                    <Select
                        options={languages}
                        value={language}
                        onChange={(e) => handleLanguageChange(e.value)}
                        placeholder={language}
                    />
                </div>
                <div className='flex flex-col'>
                    <span className='text-white'>Theme</span>
                    <Select
                        options={themes}
                        value={theme}
                        onChange={(e) => handleThemeChange(e.value)}
                        placeholder={theme}
                    />
                </div>
            </div>
            <Editor
                defaultLanguage='python'
                theme={theme}
                language={language}
                defaultValue={startingCode}
                value={code}
                onChange={handleCodeChange}
            />
            <div className='flex space-x-2 justify-end'>
                <div
                    className='flex items-center space-x-1 px-2 py-1 cursor-pointer hover:bg-gray-300 hover:text-black text-white border rounded'
                    onClick={handleCopyCode}
                >
                    <span>Copy</span>
                    <GoFileCode />
                </div>
                <div
                    className='flex items-center space-x-1 px-2 py-1 cursor-pointer hover:bg-gray-300 hover:text-black text-white border rounded'
                    onClick={handleCodeRun}
                >
                    <span>Run</span>
                    <AiFillCaretRight />
                </div>
            </div>
        </div>
    );
}

export default CodeEditor;
