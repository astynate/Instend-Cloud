import { observer } from 'mobx-react-lite';
import { useEffect, useRef, useState } from 'react';
import PopUpWindow from '../../../shared/popup-windows/pop-up-window/PopUpWindow';
import styles from './main.module.css';
import AccountState from '../../../../../state/entities/AccountState';
import Base64Handler from '../../../../../utils/handlers/Base64Handler';
import image from './images/image.png';
import ImageAttachments from '../../../ui-kit/attachments/ImageAttachments';
import FilesInputWrapper from '../../wrappers/files-input-wrapper/FilesInputWrapper';
import ButtonContent from '../../../elements/button-content/ButtonContent';
import GlobalContext from '../../../../../global/GlobalContext';
import { toJS } from 'mobx';

const CreatePublicationPopup = observer((props) => {
    const [text, setText] = useState('');
    const [attachments, setAttachments] = useState([]);
    const [isLoading, setLoadingState] = useState();
    const textareaRef = useRef(null);

    const setAsDefault = () => {
        setAttachments([]);
        setText('');
    }
  
    useEffect(() => {
        if (textareaRef.current) {
            const numberOfLines = text.split('\n').length;
            const textAreaHeight = numberOfLines * 25;
    
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textAreaHeight}px`;
        }
    }, [text]);
  
    const textareaChangeHandler = (event) => {
        setText(event.target.value);
    };
    
    useEffect(() => {
        if (!!props.publication === false) {
            setAsDefault();
        } else {
            setAttachments(toJS(props.publication.attachments));
            setText(props.publication.text);
        }
    }, [props.isOpen]);

    useEffect(() => {
        if (isLoading === true) {
            props.close();
        }
    }, [isLoading]);

    return (
        <PopUpWindow open={props.isOpen} title={'New publication'} close={props.close}>
            <div className={styles.wrapper}>
                <div className={styles.content}>
                    <div className={styles.header}>
                        <img 
                            src={Base64Handler.Base64ToUrlFormatPng(AccountState.account.avatar)} 
                            className={styles.avatar} 
                            draggable="false"
                        />
                        <div className={styles.information}>
                            <span className={styles.nickname}>{AccountState.account.nickname}</span>
                            <span className={styles.name}>{AccountState.account.name} {AccountState.account.surname}</span>
                        </div>
                    </div>
                    <textarea 
                        ref={textareaRef}
                        placeholder='Write a publication'
                        value={text}
                        className={styles.textarea}
                        autoFocus
                        onChange={textareaChangeHandler}
                    ></textarea>
                    <div className={styles.attachments}>
                        <ImageAttachments
                            isEditable={true}
                            attachments={attachments}
                            setAttachments={setAttachments}
                        />
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.controlAttachments}>
                        <span>Attach something to your post</span>
                        <div className={styles.control}>
                            <FilesInputWrapper
                                files={attachments}
                                setFiles={setAttachments} 
                                maxLength={7}
                                supportedTypes={[
                                    ...GlobalContext.supportedImageTypes,
                                    ...GlobalContext.supportedVideoTypes,
                                    ...GlobalContext.supportedMusicTypes
                                ]}
                            >
                                <img src={image} draggable="false" />
                            </FilesInputWrapper>
                        </div>
                    </div>
                    <button 
                        className={styles.postButton} 
                        onClick={async () => props.callback(text, attachments, setLoadingState)}
                    >
                        <ButtonContent 
                            label={'Post'} 
                            state={isLoading ? 'loading' : null} 
                        />
                    </button>
                </div>
            </div>
        </PopUpWindow>
    );
});

export default CreatePublicationPopup;