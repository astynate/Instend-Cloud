import styles from './main.module.css';
import attach from '../../images/attach.png';

const EditAttachments = ({callback}) => {
    return (
        <div className={styles.editAttachments} onClick={callback}>
            <img 
                src={attach} 
                draggable="false" 
            />
        </div>
    );
};

export default EditAttachments;