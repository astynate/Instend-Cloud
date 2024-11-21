import styles from './main.module.css';

const ColumnsTemplate = ({attachments}) => {
    return (
        <div className={styles.wrapper}>
            {attachments.slice(0, Math.min(attachments.length, 4)).map((image, index) => (
                <img 
                    key={index} 
                    src={image} 
                    draggable={false}
                    alt={`Attachment ${index}`} 
                />
            ))}
        </div>
    );
};

export default ColumnsTemplate;