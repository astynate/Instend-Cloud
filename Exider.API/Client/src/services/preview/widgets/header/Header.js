import React from 'react';
import styles from './main.module.css'
import PreviewButton from '../../shared/button/PreviewButton';
import account from './images/account.png';
import arrow from './images/arrow.png';
import download from './images/download.png';
import { instance } from '../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../utils/DownloadFromResponse';

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
                    onClick={async () => {
                        if (props.id) {
                            await instance
                            .get(`/file/download?id=${props.id}`, {
                                responseType: "blob"
                            })
                            .then((response) => {
                                DownloadFromResponse(response);
                            })
                            .catch((error) => {
                                console.error(error);
                                props.error('Attention!', 'Something went wrong');
                            });
                        }
                    }}
                />
            </div>
        </div>
    );
 };

export default PreviewHeader;