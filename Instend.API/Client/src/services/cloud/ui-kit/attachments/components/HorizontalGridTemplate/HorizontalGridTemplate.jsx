import { useState, useEffect } from 'react';
import styles from './main.module.css';
import ImageHelper from '../../helpers/ImageHelper';
import AttachmentImage from '../../items/image/AttachmentImage';

const HorizontalGridTemplate = ({attachments = [], isEditable = false, setAttachments = () => {}, imageCallback = () => {}}) => {
    const [sortedAttachments, setSortedAttachments] = useState([...attachments]);

    useEffect(() => { 
        // const UpdateAttachments = async () => {
        //     setSortedAttachments(await ImageHelper.SortAttachments(
        //         attachments, 
        //         (a, b) => b.aspectRatio - a.aspectRatio)
        //     );
        // }; 
            
        // UpdateAttachments();
    }, [attachments]);
    
    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                {attachments.slice(0, 2).map((image, index) => (
                    <AttachmentImage
                        key={index}
                        image={image}
                        isEditable={isEditable}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        callback={() => imageCallback(index)}
                    />
                ))}
            </div>
            {sortedAttachments.length > 2 && <div className={styles.bottom}>
                {attachments.slice(2, Math.min(sortedAttachments.length, 5)).map((image, index) => (
                    <AttachmentImage
                        key={index}
                        image={image}
                        isEditable={isEditable}
                        attachments={attachments}
                        setAttachments={setAttachments}
                        callback={() => imageCallback(index)}
                    />
                ))}
            </div>}
        </div>
    );
};

export default HorizontalGridTemplate;