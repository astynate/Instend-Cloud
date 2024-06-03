import React from "react";
import styles from './main.module.css';
import PopUpWindow from "../../../../shared/pop-up-window/PopUpWindow";
import PopUpItems from "../../../../shared/pop-up-window/elements/items/PopUpItems";

const ChatInformation = ({open, close, name, avatar, title, profileAddition}) => {
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
                            <span className={styles.status}>last seen recently</span>
                        </div>
                    </div>
                    <PopUpItems 
                        items={[
                            {
                                title: "Photos", 
                                element: <h1 className={styles.placeholder}>No photos uploaded</h1>,
                            },
                            {
                                title: "Videos", 
                                element: <h1 className={styles.placeholder}>No videos uploaded</h1>,
                            },
                            {
                                title: "Music", 
                                element: <h1 className={styles.placeholder}>No music uploaded</h1>,
                            },
                            {
                                title: "Links", 
                                element: <h1 className={styles.placeholder}>No links uploaded</h1>,
                            }
                        ]}
                    />
                </div>
            </PopUpWindow>
        </>
    );
}

export default ChatInformation;