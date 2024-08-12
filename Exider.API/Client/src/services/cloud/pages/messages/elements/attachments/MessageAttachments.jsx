import { useEffect, useState } from 'react';
import Base64Handler from '../../../../../../utils/handlers/Base64Handler';
import { PreviewVideo } from '../../../../../preview/widgets/files/PreviewVideo/PreviewVideo';
import FileAPI from '../../../../api/FileAPI';
import styles from './main.module.css';

export const validateMediaTypes = (type) => {
    const types = [...FileAPI.imageTypes, ...FileAPI.videoTypes];
    return types.includes(type.toLowerCase())
}

const MessageAttachments = ({messageId, attachments}) => {
    const [mediaAtachments, setMediaAttachments] = useState(attachments.filter(e => validateMediaTypes(e.Type)));

    return (
        <div 
            className={styles.attachments}
            type={`type-${mediaAtachments.length}`}
        >
            {mediaAtachments.map((attachment, index) => {
                return (
                    <div key={attachment.Id} className={styles.attachmentsWrapper}>
                        {FileAPI.imageTypes.includes(attachment.Type.toLowerCase()) &&
                            <img 
                                src={`data:image/${attachment.Type.toLowerCase()};base64,${attachment.Preview}`} 
                                draggable="false"
                                key={attachment.Id}
                                className={styles.image}
                                
                            />
                        }
                        {FileAPI.videoTypes.includes(attachment.Type.toLowerCase()) &&
                            <video
                                poster={Base64Handler.Base64ToUrlFormatPng(attachment.Preview)}
                                className={styles.video}
                                controls
                                muted
                                loop
                                autoPlay
                                key={attachment.Id}
                                type={`type-${index}`}
                                src={`/api/publictions/stream?publictionId=${messageId}&id=${attachment.Id}&type=3`}
                            >
                                <source src={`/api/publictions/stream?publictionId=${messageId}&id=${attachment.Id}&type=3`} />
                            </video>
                        }
                    </div>
                );
            })}
        </div>
    );
}

export default MessageAttachments;