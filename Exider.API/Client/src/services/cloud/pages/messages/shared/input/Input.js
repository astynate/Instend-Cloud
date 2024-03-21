import React, { useState, useEffect } from 'react';
import styles from './main.module.css';
import StopGeneration from '../stop-generation/StopGeneration';

const Input = (props) => {

    const [text, setText] = useState('');
    const textAreaRef = React.createRef();

    useEffect(() => {

        textAreaRef.current.style.height = 'inherit';
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + 'px';
    
    }, [text]);

    const handleChange = (event) => {
        setText(event.target.value);
        props.message[1](event.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
      }
    };
  
    const sendMessage = () => {
        setText('');
        props.isSendingMessage[1](true);
    };

    return (

        <div className={styles.wrapper}>
            {props.isSendingPossible[0] === false ? 
                <StopGeneration 
                    isStop={props.isSendingPossible} 
                    onClick={props.cancel}
                /> : null
            }
            <div className={styles.inputWrapper}>
                <textarea 
                    placeholder='Ask your question to Cyra' 
                    className={styles.input}
                    ref={textAreaRef}
                    rows={1}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={4000}
                />
            </div>
            <span>Cyra’s answers are generated by AI. Please check the information!</span>
        </div>

    );

};

export default Input;