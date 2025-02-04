import React, { useState, useEffect, useRef } from 'react';
import { MessageOperations } from '../../widgets/chat/helpers/MessageOperations';
import styles from './main.module.css';
import attach from './images/attach.png';
import MainMessageButton from '../../elements/message-button/MainMessageButton';
import PopUpList from '../../../../shared/popup-windows/pop-up-list/PopUpList';
import MessangerController from '../../../../api/MessangerController';

const Input = ({operation, chat, type = 0, callback = () => {}}) => {
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

        if (!!text === false) {
            return 
        }

        await MessangerController.SendMessage(chat, text, type);

        setText('');
        setAttachements([]);
        setSelectedFiles([]);
        setSelectedFolders([]);
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
                        <div className={styles.button}>
                            {isCreatePopUpOpen && 
                                <div 
                                    className={styles.popup} 
                                    onMouseEnter={() => Open()}
                                    onMouseLeave={() => Close()}
                                >
                                    <PopUpList 
                                        items={[
                                            { title: 'Collection' },
                                            { title: 'Album' },
                                            { title: 'Playlist' },
                                            { title: 'Photo' },
                                            { title: 'Music' },
                                            { title: 'From device' },
                                            { title: 'From cloud' }
                                        ]}
                                    />
                                </div>}
                            <MainMessageButton 
                                image={attach}
                                onMouseEnter={() => Open()}
                                onMouseLeave={() => Close()}
                                callback={() => document.getElementById('message-file-picker').click()}
                            />
                        </div>
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
                        <input 
                            type="file" 
                            id="message-file-picker" 
                            style={{ display: 'none' }} 
                            multiple 
                            onChange={handleFileChange} 
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Input;