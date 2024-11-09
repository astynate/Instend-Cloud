import AttachmentsImage from './handlers/attachments-image/AttachmentsImage';
import AttachmentsVideo from './handlers/attachments-video/AttachmentsVideo';
import styles from './main.module.css';

const Attachments = ({attachments = []}) => {
    const handlers = {
        image: AttachmentsImage,
        video: AttachmentsVideo
    };

    return (
        <div className={styles.attachements}>
            {attachments.map((attachment, index) => {
                const fileType = attachment.type.split('/')[0];

                return (
                    <div key={index}>
                        {handlers[fileType](attachment)}
                    </div>
                );
            })}
        </div>
    );
}

export default Attachments;