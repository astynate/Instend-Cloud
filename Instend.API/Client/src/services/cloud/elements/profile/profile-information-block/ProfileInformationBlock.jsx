import { useRef, useState } from 'react';
import styles from './main.module.css';
import PublicationsWrapper from '../../../features/wrappers/publications-wrapper/PublicationsWrapper';
import MarkdownInput from '../../../ui-kit/fields/markdown-input/MarkdownInput';

const ProfileInformationBlock = ({
        isEditable = false, 
        setEditableState = () => {}
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
        <PublicationsWrapper isHasBorder={true} borderRadius={30}>
            <div className={styles.textBlock} onClick={() => setEditableState(true)}>
                <div className={styles.block}>
                    <input 
                        type='text' 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)}
                        className={styles.title}
                    />
                    {/* <Attachments 
                        attachments={attachments} 
                    /> */}
                    {/* <input 
                        type="file" 
                        ref={fileInputRef} 
                        multiple
                        onChange={handleFileChange} 
                        style={{ display: 'none' }}
                    /> */}
                    <MarkdownInput
                        isEditable={false}
                        text={content}
                        setText={setContent}
                        // rightButtons={[
                        //     { image: smileFace, callback: () => {} },
                        //     { image: image, callback: handleButtonClick },
                        // ]}
                    />
                </div>
            </div>
        </PublicationsWrapper>
    );
}

export default ProfileInformationBlock;