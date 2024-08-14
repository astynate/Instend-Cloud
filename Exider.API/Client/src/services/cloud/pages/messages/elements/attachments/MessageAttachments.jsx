import { useState } from 'react';
import Base64Handler from '../../../../../../utils/handlers/Base64Handler';
import FileAPI from '../../../../api/FileAPI';
import styles from './main.module.css';

export const validateMediaTypes = (type) => {
    const types = [...FileAPI.imageTypes, ...FileAPI.videoTypes];
    return types.includes(type.toLowerCase())
}

const MessageAttachments = ({messageId, attachments, sendingType}) => {
    const GetType = (sendingType, attachment) => {
        if (sendingType === 0) {
            return attachment && attachment.type ? attachment.type.split('/')[1] : '';
        } else {
            return attachment.Type;
        }
    }

    const [mediaAtachments] = useState(attachments.filter(e => validateMediaTypes(GetType(sendingType, e))));

    return (
        <div 
            className={styles.attachments}
            type={`type-${mediaAtachments.length}`}
        >
            {mediaAtachments.map((attachment, index) => {
                const type = GetType(sendingType, attachment);

                return (
                    <div key={sendingType !== 0 ? attachment.Id : index + "attachement"} className={styles.attachmentsWrapper}>
                        {FileAPI.imageTypes.includes(type.toLowerCase()) &&
                            <img 
                                src={sendingType === 0 ? URL.createObjectURL(attachment) : `data:image/${type.toLowerCase()};base64,${attachment.Preview}`} 
                                draggable="false"
                                className={styles.image}
                            />
                        }
                        {FileAPI.videoTypes.includes(type.toLowerCase()) &&
                            <video
                                poster={Base64Handler.Base64ToUrlFormatPng(attachment.Preview)}
                                className={styles.video}
                                controls
                                muted
                                loop
                                autoPlay
                                type={`type-${index}`}
                                src={sendingType === 0 ? URL.createObjectURL(attachment) : `/api/publictions/stream?publictionId=${messageId}&id=${attachment.Id}&type=3`}
                            >
                                <source src={sendingType === 0 ? URL.createObjectURL(attachment) : `/api/publictions/stream?publictionId=${messageId}&id=${attachment.Id}&type=3`} />
                            </video>
                        }
                    </div>
                );
            })}
        </div>
    );
}

export default MessageAttachments;