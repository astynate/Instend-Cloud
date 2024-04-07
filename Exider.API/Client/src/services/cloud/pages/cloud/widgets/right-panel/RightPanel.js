import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import close from './images/close.png';
import { instance } from '../../../../../../state/Interceptors';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';

const RightPanel = (props) => {
    const [isLoading, setLoadingState] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {

        const GetFile = async () => {
            const response = await instance
                .get(`/file?id=${props.file.id}`)
                .catch(() => props.close());
                
            if (response.status === 200){
                setFile(response.data);
                setLoadingState(false);
            } else {
                setLoadingState(false);
            }
        };

        GetFile();

    }, [props.file]);

    return (
        <div className={styles.rightPanel}>
            <div className={styles.resize}></div>
            <div className={styles.header}>
                <div>
                    <div className={styles.filename}>
                    <span className={styles.name}>{props.file ? props.file.name : 'Select file'}</span>
                    <span className={styles.type}>{props.file && props.file.type !== null && props.file.type !== '' ? props.file.type : 'No type'}</span>
                    </div>
                    <span className={styles.time}>{props.file ? ConvertFullDate(props.file.lastEditTime) : 'To select file please click on it'}</span>
                </div>
                <img src={close} className={styles.button} onClick={props.close} />
            </div>
            <div className={styles.content}>
                {isLoading === true && props.file ? 
                    <div className={styles.loader}></div> 
                :
                    <div className={styles.file} dangerouslySetInnerHTML={{ __html: file }}></div>}
            </div>
        </div>
    );
 };

export default RightPanel;