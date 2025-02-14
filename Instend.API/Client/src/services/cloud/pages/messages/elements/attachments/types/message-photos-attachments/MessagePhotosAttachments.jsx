import MessageAttachmentsWrapper from '../../../../../../features/wrappers/message-attachments-wrapper/MessageAttachmentsWrapper';
import ImageAttachments from '../../../../../../ui-kit/attachments/ImageAttachments';
import styles from './main.module.css';

const MessagePhotosAttachments = ({isCurrentAccountMessage = false, photos = []}) => {
    return (
        <MessageAttachmentsWrapper isCurrentAccountMessage={isCurrentAccountMessage}>
            <div className={styles.images}>
                <ImageAttachments 
                    attachments={photos}
                />
            </div>
        </MessageAttachmentsWrapper>
    );
};

export default MessagePhotosAttachments;