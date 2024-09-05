import React from "react";
import styles from './main.module.css';
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import { observer } from "mobx-react-lite";

const ChatInformation = observer(({open, close, name, avatar, subTitle="", title, content=<></>, additionalContent=<></>}) => {
    return (
        <>
            <PopUpWindow
                open={open}
                isHeaderPositionAbsulute={false}
                isHeaderless={false}
                back={false}
                title={title}
                close={close}
            >
                <div className={styles.chatInformation}>
                    <div className={styles.header}>
                        <div className={styles.avatar}>
                            <img src={`data:image/png;base64,${avatar}`} draggable="false" />
                        </div>
                        <div className={styles.information}>
                            <div className={styles.nameWrapper}>
                                <span className={styles.name}>{name}</span>
                            </div>
                            <span className={styles.status}>{subTitle}</span>
                        </div>
                    </div>
                    <div className={styles.content}>
                        {(content)}
                    </div>
                    {(additionalContent)}
                </div>
            </PopUpWindow>
        </>
    );
});

export default ChatInformation;