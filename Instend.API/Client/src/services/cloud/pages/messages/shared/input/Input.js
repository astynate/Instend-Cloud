import React, { useState, useEffect } from 'react';
import styles from './main.module.css';
import attach from './images/attach.png';
import MainMessageButton from '../../elements/message-button/MainMessageButton';
import PopUpList from '../../../../shared/popup-windows/pop-up-list/PopUpList';
import MessangerController from '../../../../api/MessangerController';
import InstendCloud from '../../../../integrations/instend-cloud/InstendCloud';
import InputAttachments from './widgets/InputAttachments/InputAttachments';
import send from './images/send.png';

const Input = ({operation, chat, type = 0, callback = () => {}}) => {
    const [text, setText] = useState('');
    const [attachments, setAttachements] = useState([]);
    const [isCreatePopUpOpen, setCreatePopUpState] = useState(false);
    const [timer, setTimer] = useState(null);
    const [collections, setCollections] = useState([]);
    const [isInstendCloud, setInstendCloudState] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [windowIndex, setWindowIndex] = useState(0);
    const textAreaRef = React.createRef();

    const handleFileChange = (event) => {
        if (event.target.files.length > 0) {
            setAttachements(Array.from(event.target.files).slice(0, 7));
        };
    };

    const Open = () => {
        clearTimeout(timer);
        setCreatePopUpState(true);
    };

    const Close = () => {
        setTimer(
            setTimeout(() => {
                setCreatePopUpState(false);
            }, 500)
        );
    };

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
      };
    };
  
    const sendMessageAsync = async () => {
        if (!!text === false) {
            return 
        };

        const previousText = text;
        const previousAttachments = attachments;
        const previousCollections = collections;
        const previousFiles = selectedFiles;

        setText('');
        setAttachements([]);
        setSelectedFiles([]);
        setCollections([]);

        await MessangerController.SendMessage(
            chat, 
            previousText, 
            type,
            previousAttachments,
            previousCollections,
            previousFiles,
        );
    };

    const openInstendCloudSubSystem = (index) => {
        setInstendCloudState(true);
        setWindowIndex(index);
    };

    const isHasAttachments = () => {
        if (attachments.length > 0) {
            return true;
        };

        if (selectedFiles.length > 0) {
            return true;
        };

        if (collections.length > 0) {
            return true;
        };

        return false;
    };

    return (
        <>
            <InstendCloud 
                isOpen={isInstendCloud}
                close={() => setInstendCloudState(false)}
                collections={collections}
                files={selectedFiles}
                setSelectedFiles={setSelectedFiles}
                windowIndex={windowIndex}
                setSelectedCollections={setCollections}
            />
            <div className={styles.input}>
                <div className={styles.wrapper}>
                    <div className={styles.button}>
                        {isCreatePopUpOpen && 
                            <div 
                                className={styles.popup} 
                                onMouseEnter={() => Open()}
                                onMouseLeave={() => Close()}
                            >
                                <PopUpList 
                                    items={[
                                        { title: 'Photos', callback: () => openInstendCloudSubSystem(1) },
                                        { title: 'Songs', callback: () => openInstendCloudSubSystem(2) },
                                        { title: 'From device', callback: () => document.getElementById('message-file-picker').click() },
                                        { title: 'From cloud', callback: () => openInstendCloudSubSystem(0) }
                                    ]}
                                />
                            </div>}
                        {isHasAttachments() === false && <MainMessageButton 
                            image={attach}
                            onMouseEnter={() => Open()}
                            onMouseLeave={() => Close()}
                            callback={() => document.getElementById('message-file-picker').click()}
                        />}
                    </div>
                    <div className={styles.inputWrapper}>
                        {isHasAttachments() && 
                            <InputAttachments 
                                files={selectedFiles}
                                collections={collections}
                                attachements={attachments}
                                setAttachemnts={setAttachements}
                                setSelectedFiles={setSelectedFiles}
                                setCollections={setCollections}
                                setInstendCloudState={() => setInstendCloudState(true)}
                            />}
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
                            onInput={handleFileChange} 
                        />
                    </div>
                    {!!text === true && <MainMessageButton 
                        image={send}
                        isInverted={false}
                        callback={sendMessageAsync}
                    />}
                </div>
            </div>
        </>
    );
};

export default Input;