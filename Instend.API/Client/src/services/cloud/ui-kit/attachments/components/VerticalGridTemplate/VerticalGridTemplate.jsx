import { useState, useEffect } from 'react';
import styles from './main.module.css';
import ImageHelper from '../../helpers/ImageHelper';
import TypeHelper from '../../helpers/TypeHelper';

const VerticalGridTemplate = ({attachments = []}) => {
    const [sortedAttachments, setSortedAttachments] = useState([]);
    const [endIndex, setEndIndex] = useState(1);

    const GetEndIndex = async () => {{
        const isCountLessThanTwo = await TypeHelper.CompareCountWithDimention(
            attachments, 
            0, 
            1.3, 
            (count) => count < 2
        );

        if (attachments.length < 5) 
            return 1;

        return isCountLessThanTwo ? 1 : 2;
    }}

    useEffect(() => { 
        const UpdateAttachments = async () => {
            setSortedAttachments(await ImageHelper.SortAttachments(
                attachments, 
                (a, b) => a.aspectRatio - b.aspectRatio)
            );

            setEndIndex(await GetEndIndex());
        }; 
            
        UpdateAttachments(); 
    }, [attachments]);

    return (
        <div className={styles.wrapper} state={endIndex === 1 ? "one" : ""}>
            <div className={styles.left}>
                {sortedAttachments.slice(0, endIndex).map((image, index) => (
                    <img 
                        key={index} 
                        src={image} 
                        draggable={false}
                        alt={`Attachment ${index}`} 
                    />
                ))}
            </div>
            <div className={styles.right}>
                {sortedAttachments.slice(endIndex, Math.min(sortedAttachments.length, 5)).map((image, index) => (
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