import React from "react";
import styles from './main.module.css';
import pin from './images/pin.png';

const PinnedMessages = ({items}) => {
    return (
        <div className={styles.pinnedMessages}>
            {/* <div className={styles.number}>
                <span># 1</span>
            </div> */}
            <div className={styles.info}>
                <span className={styles.title}>Pinned messages</span>
                <span className={styles.messageText}>{items[items.length - 1].Text}</span>
            </div>
            <div className={styles.controlPanel}>
                <img 
                    src={pin} 
                    className={styles.pinImage}
                />
            </div>
        </div>
    );
}

export default PinnedMessages;