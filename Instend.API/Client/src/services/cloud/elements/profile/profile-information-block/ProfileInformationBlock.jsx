import { useRef, useState } from 'react';
import PublicationsWrapper from '../../../../features/publications-wrapper/PublicationsWrapper';
import styles from './main.module.css';
import smileFace from './images/smile-face.png';
import image from './images/image.png';
import MarkdownInput from '../../../../shared/ui-kit/markdown-input/MarkdownInput';
import Attachments from '../../../../elements/attachments/Attachments';

const ProfileInformationBlock = ({
        isEditable, 
        setEditableState
    }) => {
        
    const [title, setTitle] = useState('Title');
    const [content, setContent] = useState('');
    const [attachments, setAttachments] = useState([]);
    const fileInputRef = useRef(null); 
    
    const handleButtonClick = () => { 
        if (fileInputRef.current) { 
            fileInputRef.current.click(); 
        } 
    }; 
    
    const handleFileChange = (event) => {
        setAttachments(Array.from(event.target.files));
    }

    return (
        <PublicationsWrapper>
            <div className={styles.textBlock} onClick={() => setEditableState(true)}>
                <div className={styles.block}>
                    <input 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.title}
                    />
                    <Attachments 
                        attachments={attachments} 
                    />
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple
                        onChange={handleFileChange} 
                        style={{ display: 'none' }}
                    />
                    <MarkdownInput 
                        text={content}
                        setText={setContent}
                        rightButtons={[
                            { image: smileFace, callback: () => {} },
                            { image: image, callback: handleButtonClick },
                        ]}
                    />
                </div>
            </div>
        </PublicationsWrapper>
    );
}

export default ProfileInformationBlock;