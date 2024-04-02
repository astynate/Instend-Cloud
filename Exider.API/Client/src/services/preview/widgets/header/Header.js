import React, { useEffect } from 'react';
import styles from './main.module.css'
import PreviewButton from '../../shared/button/PreviewButton';
import account from './images/account.png';
import arrow from './images/arrow.png';
import trash from './images/trash.png';
import download from './images/download.png';

const PreviewHeader = (props) => {
    return (
        <div className={styles.header} ref={props.forwardRef}>
            <div className={styles.buttons}>
                <PreviewButton src={arrow} onClick={props.close} />
                <PreviewButton 
                    src={account}
                    title="Open access" 
                />
            </div>
            <div className={styles.center}>
                <h1 className={styles.name}>{props.name}</h1>
                <p className={styles.time}>{props.time}</p>
            </div>
            <div className={styles.buttons}>
                <PreviewButton 
                    src={download}
                    title="Download" 
                />
            </div>
        </div>
    );
 };

export default PreviewHeader;