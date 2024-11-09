import React, { useState, useEffect, useRef } from 'react';
import { MessageOperations } from '../../widgets/chat/helpers/MessageOperations';
import { SendMessage } from './MessageAPI';
import NextButton, { ButtonDirections } from '../../../../shared/ui-kit/next-button/NextButton';
import styles from './main.module.css';
import MainMessageButton from '../../elements/message-button/MainMessageButton';
import attach from './images/attach.png';
import smile from './images/smile.png';
import voice from './images/voice.png';
import cancel from './images/cancel.png';
import send from './images/send.png';
import PopUpList from '../../../../shared/ui-kit/pop-up-list/PopUpList';
import File from '../../../cloud/shared/file/File';
import Folder from '../../../cloud/shared/folder/Folder';
import InstendCloud from '../../../../sub-systems/yexider-cloud/InstendCloud';

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
    const validOperations = [MessageOperations.Edit, MessageOperations.Reply];

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

    useEffect(() => {
        // const handleClickOutside = (event) => {
        //     if (textAreaRef.current && !textAreaRef.current.contains(event.target)) {
        //         textAreaRef.current.focus();
        //     }
        // };

        // document.addEventListener('click', handleClickOutside);
        
        // return () => {
        //     document.removeEventListener('click', handleClickOutside);
        // };
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
        const selectedFilesValue = [...selectedFiles].map(e => e.id);
        const selectedFoldersValue = [...selectedFolders].map(e => e.id);
        const attachmentsValue = [...attachments];
        const textValue = text;
        const replyTo = operation === MessageOperations.Reply ? '' : '';

        setText('');
        setAttachements([]);
        setSelectedFiles([]);
        setSelectedFolders([]);

        await SendMessage(
            textValue, 
            attachmentsValue, 
            replyTo, 
            chat, 
            type,
            selectedFilesValue,
            selectedFoldersValue
        );
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
            <InstendCloud
                open={isInstendCloud} 
                close={() => setInstendCloudState(false)} 
                selectedFiles={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                setSelectedFolders={setSelectedFolders}
            />
            <div className={styles.input}>
                <div className={styles.wrapper}>
                    {isCreatePopUpOpen && 
                        <div 
                            className={styles.createPopUpWindow} 
                            onMouseEnter={() => Open()}
                            onMouseLeave={() => Close()}
                        >
                            <PopUpList 
                                items={[
                                    {title: "From Cloud", callback: () => {setInstendCloudState(true)}},
                                    {title: "From Device", callback: () => document.getElementById('message-file-picker').click()},
                                    // {title: "Transaction", callback: () => {}}
                                ]}
                                close={() => Close()}
                            />
                        </div>}
                    <input type="file" id="message-file-picker" style={{ display: 'none' }} multiple onChange={handleFileChange} />
                    <div 
                        onScroll={HandleAttechmentsScroll}
                        className={styles.attachmentsWrapper}
                        ref={attachmentsAreaRef}
                        id={(attachments.length > 0 || 
                             selectedFiles.length > 0 || 
                             selectedFolders.length > 0) 
                        ? 
                            'open' : null}
                        
                    >
                        {isLeftArrowOpen && <div className={styles.next} direction={"left"}>
                            <NextButton 
                                direction={ButtonDirections.left} 
                                callback={() => HandleNextButtonClick(-SCROLL_SPEED)} 
                            />
                        </div>}
                        {selectedFolders.map((element) =>
                            <div className={styles.fileWrapper} key={element.id}>
                                <Folder 
                                    id={element.id}
                                    isSelected={false}
                                    folder={element}
                                    name={element.name} 
                                    time={element.creationTime}
                                    isLoading={element.isLoading}
                                    setSelectedFolders={setSelectedFolders}
                                />
                            </div>
                        )}
                        {selectedFiles.map((element) =>
                            <div className={styles.fileWrapper} key={element.id}>
                                <File
                                    name={element.name}
                                    file={element}
                                    time={element.lastEditTime}
                                    image={element.preview == "" ? null : element.preview}
                                    type={element.type}
                                    isLoading={element.isLoading}
                                    isSelected={false}
                                    setSelectedFiles={setSelectedFiles}
                                />
                            </div>
                        )}
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
                        {isRightArrowOpen && <div className={styles.next} direction={"right"}>
                            <NextButton 
                                callback={() => HandleNextButtonClick(SCROLL_SPEED)} 
                            />
                        </div>}
                    </div>
                    <div className={styles.inputWrapper}>
                        <MainMessageButton 
                            image={attach}
                            onMouseEnter={() => Open()}
                            onMouseLeave={() => Close()}
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
            </div>
        </>
    );
};

export default Input;