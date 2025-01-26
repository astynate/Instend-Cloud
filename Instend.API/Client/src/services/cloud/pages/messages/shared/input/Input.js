import React, { useState, useEffect, useRef } from 'react';
import { MessageOperations } from '../../widgets/chat/helpers/MessageOperations';
import styles from './main.module.css';
import attach from './images/attach.png';
import smile from './images/smile.png';
import send from './images/send.png';
import voice from './images/voice.png';
import MainMessageButton from '../../elements/message-button/MainMessageButton';

const Input = ({operation, setDefaultOperation, chat, type = 0}) => {
    const [text, setText] = useState('');
    const [attachments, setAttachements] = useState([]);
    const [isCreatePopUpOpen, setCreatePopUpState] = useState(false);
    const [timer, setTimer] = useState(null);
    const [isInstendCloud, setInstendCloudState] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedFolders, setSelectedFolders] = useState([]);
    const [isLeftArrowOpen, setLeftArrowOpenState] = useState(false);
    const [isRightArrowOpen, setRightArrowOpenState] = useState(false);
    const textAreaRef = React.createRef();
    const attachmentsAreaRef = useRef();

    const SCROLL_SPEED = 200;

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setAttachements(Array.from(event.target.files).slice(0, 10));
        }
    };

    const Open = () => {
        clearTimeout(timer);
        setCreatePopUpState(true);
    }

    const Close = () => {
        setTimer(
            setTimeout(() => {
                setCreatePopUpState(false);
            }, 300)
        );
    }

    useEffect(() => {
        textAreaRef.current.style.height = 'inherit';
        const scrollHeight = textAreaRef.current.scrollHeight;
        textAreaRef.current.style.height = scrollHeight + 'px';
    }, [text]);

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
        const selectedFilesValue = [...selectedFiles].map(e => e.id);
        const selectedFoldersValue = [...selectedFolders].map(e => e.id);
        const attachmentsValue = [...attachments];
        const textValue = text;
        const replyTo = operation === MessageOperations.Reply ? '' : '';

        setText('');
        setAttachements([]);
        setSelectedFiles([]);
        setSelectedFolders([]);

        // await SendMessage(
        //     textValue, 
        //     attachmentsValue, 
        //     replyTo, 
        //     chat, 
        //     type,
        //     selectedFilesValue,
        //     selectedFoldersValue
        // );
    };

    const HandleAttechmentsScroll = () => {
        const ref = attachmentsAreaRef.current;

        if (ref) {
            const offset = ref.scrollLeft;
            const isRightOpen = ref.scrollWidth > ref.clientWidth;
            
            setLeftArrowOpenState(offset > 30);
            setRightArrowOpenState(isRightOpen);
        }
    }

    const HandleNextButtonClick = (offset) => {
        if (attachmentsAreaRef.current) {
            attachmentsAreaRef.current.scrollLeft += offset;
        }
    }

    useEffect(() => {
        HandleAttechmentsScroll();
    }, [selectedFiles.length, selectedFolders.length])

    return (
        <>
            <div className={styles.input}>
                <div className={styles.wrapper}>
                    <div className={styles.inputWrapper}>
                        <MainMessageButton 
                            image={attach}
                            onMouseEnter={() => Open()}
                            onMouseLeave={() => Close()}
                            callback={() => document.getElementById('message-file-picker').click()}
                        />
                        <textarea 
                            placeholder='Type a message' 
                            className={styles.input}
                            ref={textAreaRef}
                            rows={1}
                            value={text}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            maxLength={4000}
                            autoFocus
                        />
                        {/* <MainMessageButton
                            image={smile}
                        />
                        <MainMessageButton 
                            image={text !== '' ? send : voice}
                        /> */}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Input;