import { useState } from 'react';
import styles from './main.module.css';
import ChatInformation from '../../../../features/chat-information/ChatInformation';

const MessangerHeader = ({
        avatar, 
        title, 
        subTitle, 
        isChatInformation,
        setChatInformation,
        additionalContent=<></>, 
        content=<></>
    }) => {

    return (
        <>
            <ChatInformation 
                open={isChatInformation}
                close={() => setChatInformation(false)}
                name={title}
                avatar={avatar}
                subTitle={subTitle}
                title={"Group information"}
                additionalContent={additionalContent}
                content={content}
            />
            <div className={styles.header}>
            <div className={styles.left} onClick={() => setChatInformation(true)}>
                    {/* {isMobile && 
                        <img 
                            src={back} 
                            className={styles.back} 
                            onClick={close}
                        />} */}
                    <div className={styles.avatar}>
                        <img 
                            src={`data:image/png;base64,${avatar}`}
                            className={styles.avatarImage} 
                            draggable="false"
                        />
                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>{title}</span>
                        <span className={styles.data}>{subTitle}</span>
                    </div>
                </div>
                <div className={styles.right}>
                    {/* <img src={info} 
                        className={styles.buttonImage} 
                        draggable="false"
                        // onClick={() => setOpenState(true)}
                    /> */}
                </div>
            </div>
        </>
    );
}

export default MessangerHeader;