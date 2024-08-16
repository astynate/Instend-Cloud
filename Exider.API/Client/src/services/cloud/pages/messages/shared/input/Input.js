import React, { useState, useEffect } from 'react';
import styles from './main.module.css';
import MainMessageButton from '../../elements/message-button/MainMessageButton';
import attach from './images/attach.png';
import smile from './images/smile.png';
import voice from './images/voice.png';
import cancel from './images/cancel.png';
import send from './images/send.png';
import reply from './images/reply.png';
import reject from './images/reject.png';
import { MessageOperations } from '../../widgets/chat/MessageOperations';
import ChatHandler from '../../../../../../utils/handlers/ChatHandler';

const Input = ({sendMessage, operation, messages, setDefaultOperation}) => {
    const [text, setText] = useState('');
    const [attachments, setAttachements] = useState([]);
    const [message, setMessage] = useState(undefined);
    const textAreaRef = React.createRef();

    useEffect(() => {
        if (messages.length > 0) {
            setMessage(messages[0]);
        } else {
            sendMessage(undefined);
        }
    }, [operation]);
    
    const validOperations = [MessageOperations.Edit, MessageOperations.Reply];

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setAttachements(Array.from(event.target.files).slice(0, 10));
        }
    };

    useEffect(() => {
        textAreaRef.current.style.height = 'inherit';
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + 'px';
    }, [text]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
                textAreaRef.current.focus();
            }
        };

        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    const handleChange = (event) => {
        setText(event.target.value);
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessageAsync();
      }
    };
  
    const sendMessageAsync = async () => {
        const attachmentsValue = [...attachments];
        const textValue = text;
        const replyTo = operation === MessageOperations.Reply && message ? message.Id : null;

        setText('');
        setAttachements([]);

        await sendMessage(textValue, attachmentsValue, replyTo);
    };

    return (
        <div className={styles.wrapper}>
            {validOperations.includes(operation) && message && <div className={styles.reply}>
                <img className={styles.replyImage} src={reply} />
                <div className={styles.replyInformation}>
                    <span className={styles.replyName}>{
                        operation === MessageOperations.Reply ? 
                            `Reply to ${ChatHandler.GetMessageUser(message).nickname ?? ChatHandler.GetMessageUser(message).Nickname}` 
                        : 
                            'Edit'
                    }</span>
                    <span className={styles.replyMessage}>{message.Text ?? "Message"}</span>
                </div>
                <button className={styles.replyReject} onClick={() => setDefaultOperation()}>
                    <img className={styles.replyImage} src={reject} />
                </button>
            </div>}
            <input type="file" id="message-file-picker" style={{ display: 'none' }} multiple onChange={handleFileChange} />
            <div className={styles.attachmentsWrapper} id={attachments.length > 0 ? 'open' : null}>
                {attachments.map((file, index) => {
                    const type = file.type ? file.type.split('/')[0] : null;

                    return (
                        <div className={styles.file} key={'file' + index}>
                            <div 
                                className={styles.close}
                                onClick={() => {
                                    const newAttachments = [...attachments];
                                    newAttachments.splice(index, 1);
                                    setAttachements(newAttachments);
                                }}
                            >
                                <img src={cancel} className={styles.closeImage} draggable="false" />
                            </div>
                            {type === 'image' && <img src={URL.createObjectURL(file)} className={styles.image} draggable="false" />}
                            {type === 'video' && 
                                <video controls autoPlay={true} muted={true} loop>
                                    <source src={URL.createObjectURL(file)} type={file.type} />
                                </video>
                            }
                            <span className={styles.fileName}>{file.name}</span>
                        </div>
                    );
                })}
            </div>
            <div className={styles.inputWrapper}>
                <MainMessageButton 
                    image={attach}
                    callback={() => document.getElementById('message-file-picker').click()}
                />
                <textarea 
                    placeholder='Write a message...' 
                    className={styles.input}
                    ref={textAreaRef}
                    rows={1}
                    value={text}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    maxLength={4000}
                    autoFocus
                />
                <MainMessageButton
                    image={smile}
                />
                <MainMessageButton 
                    image={text !== '' ? send : voice}
                />
            </div>
        </div>
    );
};

export default Input;