import { useState, useEffect } from 'react';
import styles from './main.module.css';
import ImageHelper from '../../helpers/ImageHelper';

const VerticalGridTemplate = ({attachments = []}) => {
    const [sortedAttachments, setSortedAttachments] = useState([]);

    useEffect(() => { 
        const UpdateAttachments = async () => {
            setSortedAttachments(await ImageHelper.SortAttachments(
                attachments, 
                (a, b) => b.aspectRatio - a.aspectRatio)
            );
        }; 
            
        UpdateAttachments(); 
    }, [attachments]);

    return (
        <div className={styles.wrapper}>
            <div className={styles.top}>
                {sortedAttachments.slice(0, 2).map((image, index) => (
                    <img 
                        key={index} 
                        src={image} 
                        draggable={false}
                        alt={`Attachment ${index}`} 
                    />
                ))}
            </div>
            <div className={styles.bottom}>
                {sortedAttachments.slice(2, Math.min(sortedAttachments.length, 5)).map((image, index) => (
                    <img 
                        key={index} 
                        src={image} 
                        draggable={false}
                        alt={`Attachment ${index}`} 
                    />
                ))}
            </div>
        </div>
    );
};

export default VerticalGridTemplate;