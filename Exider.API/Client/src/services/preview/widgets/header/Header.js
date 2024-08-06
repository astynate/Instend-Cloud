import React from 'react';
import styles from './main.module.css';
import PreviewButton from '../../shared/button/PreviewButton';
import close from './images/close.png';
import download from './images/download.png';
import zoomIn from './images/zoom-in.png';
import zoomOut from './images/zoom-out.png';
import more from './images/more.png';
import { instance } from '../../../../state/Interceptors';
import { DownloadFromResponse } from '../../../../utils/DownloadFromResponse';

const PreviewHeader = (props) => {
    return (
        <div className={styles.header} ref={props.forwardRef}>
            <div className={styles.buttons}>
                <PreviewButton src={close} onClick={props.close} />
            </div>
            <div className={styles.center}>
                <h1 className={styles.name}>{props.name}</h1>
                <p className={styles.time}>{props.time}</p>
            </div>
            <div className={styles.buttons}>
                <PreviewButton 
                    src={zoomIn}
                    title=""
                />
                <PreviewButton 
                    src={zoomOut}
                    title=""
                />
                <PreviewButton 
                    src={more}
                    title=""
                    onClick={async () => {
                        // if (props.id) {
                        //     await instance
                        //     .get(`/file/download?id=${props.id}`, {
                        //         responseType: "blob"
                        //     })
                        //     .then((response) => {
                        //         DownloadFromResponse(response);
                        //     })
                        //     .catch((error) => {
                        //         console.error(error);
                        //         props.error('Attention!', 'Something went wrong');
                        //     });
                        // }
                    }}
                />
            </div>
        </div>
    );
 };

export default PreviewHeader;