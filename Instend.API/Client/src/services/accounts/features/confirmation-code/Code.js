import React, { useRef, useEffect, useState } from 'react';
import { handleInputChange, handlePaste } from './FieldHandler';
import './main.css';

let inputRefs;

const Code = (props) => {
    inputRefs = useRef(Array(6).fill(0).map(() => React.createRef()));

    useEffect(() => {
        document.addEventListener('paste', handlePaste);

        return () => { 
            document.removeEventListener('paste', handlePaste); 
        };
    }, []);

    return (
        <div className='confirmation-code'>
            {Array(6)
                .fill(0)
                .map((_, index) => (
                    <input
                        key={index}
                        ref={inputRefs.current[index]}
                        className='code-input'
                        onKeyUpCapture={(event) => handleInputChange(event, index, props.setCode)}
                        maxLength={1}
                        autoFocus={index === 0}
                    />)
                )
            }
        </div>
    );
}

export default Code;
export { inputRefs };