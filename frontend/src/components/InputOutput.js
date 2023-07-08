import React from "react";
import Editor from "@monaco-editor/react";

function InputOutput({ theme, input, output, handleInputChange }) {
    return (
        <div className='flex flex-col mx-3 my-5 space-y-4'>
            <div className='flex flex-col h-[45vh] w-[25vw]'>
                <span>Input</span>
                <Editor
                    theme={theme}
                    value={input}
                    onChange={handleInputChange}
                    options={{
                        wordWrap: 'on',
                        lineNumbers: 'off',
                        lineWidth: 25
                    }}
                />
            </div>
            <div className='flex flex-col h-[45vh] w-[25vw]'>
                <span>Output</span>
                <Editor
                    theme={theme}
                    value={output}
                    options={{
                        wordWrap: 'on',
                        lineNumbers: 'off',
                        lineWidth: 25,
                        readOnly: true
                    }}
                />
            </div>
        </div>
    );
}

export default InputOutput;