import GlobalContext from '../../../../../../global/GlobalContext';
import styles from './main.module.css';
import MessageCollectionsAttachments from './types/message-collections-attachments/MessageCollectionsAttachments';
import MessageFilesAttachments from './types/message-files-attachments/MessageFilesAttachments';
import MessagePhotosAttachments from './types/message-photos-attachments/MessagePhotosAttachments';
import MessageVideoAttachments from './types/message-video-attachment/MessageVideoAttachments';

const MessageAttachments = ({isCurrentAccountMessage = false, message = {}}) => {
    const isSingleVideo = (files = []) => {
        if (files.length !== 1) {
            return false;
        };

        if (GlobalContext.supportedVideoTypes.includes(files[0].type) === false) {
            return false;
        };

        return true;
    };

    const isAllFilesArePhotos = (files = []) => {
        for (let file of files) {
            if (GlobalContext.supportedImageTypes.includes(file.type) === false) {
                return false;
            };
        };

        return true;
    };

    const getHandler = () => {
        if (message.collections && message.collections.length > 0) {
            return <MessageCollectionsAttachments 
                isCurrentAccountMessage={isCurrentAccountMessage}
                collections={message.collections}
            />;
        };

        if (message.files && message.files.length > 0) {
            if (isSingleVideo(message.files)) {
                return <MessageVideoAttachments 
                    isCurrentAccountMessage={isCurrentAccountMessage}
                    path={message.files[0].path}
                />;
            };

            if (isAllFilesArePhotos(message.files)) {
                return <MessagePhotosAttachments 
                    isCurrentAccountMessage={isCurrentAccountMessage}
                    photos={message.files}
                />;
            };

            return <MessageFilesAttachments
                isCurrentAccountMessage={isCurrentAccountMessage} 
                files={message.files}
            />;
        };

        if (message.attachments && message.attachments.length > 0) {
            if (isSingleVideo(message.attachments)) {
                return <MessageVideoAttachments 
                    path={message.attachments[0].path}
                />;
            };

            if (isAllFilesArePhotos(message.files)) {
                return <MessagePhotosAttachments 
                    photos={message.attachments}
                />;
            };

            return <MessageFilesAttachments 
                files={message.attachments}
            />;
        };

        return <></>;
    };

    let Handler = getHandler();

    return (
        <div className={styles.attachments}>
            {Handler}
        </div>
    );
};

export default MessageAttachments;