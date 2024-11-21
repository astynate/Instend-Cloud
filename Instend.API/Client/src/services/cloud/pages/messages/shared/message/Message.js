// import React, { useEffect } from 'react';
// import styles from './main.module.css';
// import { ConvertDateToTime } from '../../../../../../utils/DateHandler';
// import MessageAttachments from '../../elements/attachments/MessageAttachments';
// import viewed from './image/sent.svg';
// import sended from './image/tick.svg';
// import sending from './image/time.svg';
// import { instance } from '../../../../../../state/Interceptors';
// import { SpecialTypes } from '../../../../../../utils/handlers/SpecialType';
// import AlertMesssage from '../special-messages/alert/alert-message';

const Message = ({
        id, 
        text, 
        type, 
        avatar, 
        position, 
        time, 
        isSelected, 
        attachments, 
        sendingType = 0, 
        chatId,
        message,
        specialType = SpecialTypes.None
    }) => {

    // const types = [styles.first, styles.middle, styles.last, styles.single];
    // const sendingTypes = [sending, sended, viewed];

    // useEffect(() => {
    //     if (type !== 'My' && sendingType === 1 && specialType === SpecialTypes.None) {
    //         (async () => await instance.post(`/api/message/view?id=${id}&chatId=${chatId}`))();
    //     }
    // }, []);

    // if (specialType === SpecialTypes.Alert) {
    //     return (
    //         <AlertMesssage message={text} />
    //     )
    // }

    // return(
    //     <div className={styles.message} id={isSelected ? 'selected' : null}>
    //         {position === 2 || position === 3 ? 
    //             <div className={styles.avatar}>
    //                 {avatar && <img 
    //                     src={`data:image/png;base64,${avatar}`} 
    //                     className={styles.avatar}
    //                     draggable='false'
    //                 />}
    //             </div>
    //         :
    //             <div className={styles.avatarPlaceholder}></div>
    //         }
    //         <div className={`${styles.messageContent} ${types[position]}`} id={type}>
    //             {attachments && attachments.length > 0 && 
    //                 <MessageAttachments 
    //                     messageId={id}
    //                     type={type} 
    //                     position={position} 
    //                     attachments={attachments} 
    //                     sendingType={sendingType}
    //                 />}
    //             {message.folders && message.folders.map(e => {
    //                 return <h1>!!!</h1>;
    //             })}
    //             <div className={styles.messageText}>
    //                 <div className={styles.textParts}>
    //                     {text.split('\n').map((part, index) => (
    //                         <span 
    //                             key={index + "text"}
    //                             className={styles.text}
    //                         >
    //                             {part}
    //                         </span>
    //                     ))}
    //                 </div>
    //                 <div className={styles.information}>
    //                     <span className={styles.time}>{time ? ConvertDateToTime(time) : null}</span>
    //                     {type === "My" && <img src={sendingTypes[sendingType]} className={styles.messageState} />}
    //                 </div>
    //             </div>
    //         </div>
    //     </div>
    // );
};

export default Message;