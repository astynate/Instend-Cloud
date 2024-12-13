import AttachmentImage from '../../items/image/AttachmentImage';
import styles from './main.module.css';

const ColumnsTemplate = ({attachments, isEditable, setAttachments = () => {}}) => {
    return (
        <div className={styles.wrapper}>
            {attachments.slice(0, Math.min(attachments.length, 4)).map((image, index) => (
                <AttachmentImage
                    key={index}
                    image={image}
                    isEditable={isEditable}
                    attachments={attachments}
                    setAttachments={setAttachments}
                />
            ))}
        </div>
    );
};

export default ColumnsTemplate;