import { useEffect, useState } from 'react';
import styles from './main.module.css';

const AttachmentsImage = ({attachment}) => {
    const [previewUrl, setPreviewUrl] = useState('');
    
    useEffect(() => {
        if (attachment) { 
            const reader = new FileReader(); 

            reader.onloadend = () => { 
                setPreviewUrl(reader.result); 
            }; 
            
            reader.readAsDataURL(attachment); 
        }
    }, []);

    console.log(previewUrl)
    
    return (
        <div className={styles.attachements}>
            <img src={previewUrl} />
        </div>
    );
}

export default AttachmentsImage;