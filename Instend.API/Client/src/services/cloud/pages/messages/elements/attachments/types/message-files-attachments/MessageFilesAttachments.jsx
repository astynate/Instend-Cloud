import { FormatFileSize } from '../../../../../../../../utils/handlers/StorageSpaceHandler';
import MessageAttachmentsWrapper from '../../../../../../features/wrappers/message-attachments-wrapper/MessageAttachmentsWrapper';
import styles from './main.module.css';

const MessageFilesAttachments = ({isCurrentAccountMessage = false, files = []}) => {
    return (
        <MessageAttachmentsWrapper isCurrentAccountMessage={isCurrentAccountMessage}>
            <div className={styles.files}>
                {files.map(file => {
                    return (
                        <div key={file.id} className={styles.file}>
                            <div className={styles.icon}>
                                <span>{file.type}</span>
                            </div>
                            <div className={styles.information}>
                                <span>{file.name}</span>
                                <span>{FormatFileSize(file.size)}</span>
                            </div>
                        </div>
                    )
                })}
            </div>
        </MessageAttachmentsWrapper>
    );
};

export default MessageFilesAttachments;