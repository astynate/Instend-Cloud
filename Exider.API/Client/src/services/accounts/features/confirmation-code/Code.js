import React, { useRef, useEffect } from 'react';
import './main.css';

const Code = () => {

    const inputRefs = useRef(Array(6).fill(0)
        .map(() => React.createRef()));

    useEffect(() => {

        const handlePaste = (event) => {

            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedData = clipboardData.getData('text');

            if (pastedData.length === 6) {

                pastedData.split('').forEach((value, index) => {

                    inputRefs.current[index].current.value = value;

                });

            }

            event.preventDefault();

        };

        document.addEventListener('paste', handlePaste);

        return () => {

            document.removeEventListener('paste', handlePaste);

        };

    }, []);

    const handleInputChange = (event, index) => {

        try {

            if (!event.target.value && index > 0) {

                inputRefs.current[index - 1].current.focus();

            }

            if (event.target.value && index < 5) {

                inputRefs.current[index + 1].current.focus();

            }

        } catch { }

    };

    return (

        <div className='confirmation-code'>
            {Array(6)
                .fill(0)
                .map((_, index) => (
                    <input
                        key={index}
                        ref={inputRefs.current[index]}
                        className='code-input'
                        onKeyUpCapture={(e) => handleInputChange(e, index)}
                        maxLength={1}
                        autoFocus={index === 0}
                    />)
                )
            }
        </div>
    
    );

}

export default Code;