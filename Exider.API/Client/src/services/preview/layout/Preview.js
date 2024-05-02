import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PreviewHeader from '../widgets/header/Header';
import { instance } from '../../../state/Interceptors';
import { ConvertFullDate } from '../../../utils/DateHandler';

const Preview = (props) => {
    const [isLoading, setLoadingState] = useState(true);
    const [file, setFile] = useState(null);
    const fileRef = useRef();
    const [scaleFactor, setScaleFactor] = useState(100);

    useEffect(() => {
        try {
            let firstChild = fileRef.current.querySelector('*');
            firstChild.style.transform = `scale(${scaleFactor}%)`;
        } catch { }
    }, [scaleFactor])

    useEffect(() => {
        const GetFile = async () => {
            if (props.file && props.file.strategy === 'file') {
                await instance
                .get(`/file?id=${props.file.id}`)
                .then((response) => {
                    setFile(response.data);
                    setLoadingState(false);
                })
                .catch((error) => {
                    props.ErrorMessage('Attention!', error.response.data);
                    props.close();
                });
            }
        };

        GetFile();
    }, []);

    return (
        <div className={styles.wrapper}>
            <PreviewHeader 
                name={props.file.name}
                time={ConvertFullDate(props.file.lastEditTime)}
                close={props.close}
                id={props.file.id}
                error={props.ErrorMessage}
            />
            {isLoading ?
                <div className={styles.loader}></div>
            :   
                <div className={styles.preview}>
                    <div 
                        className={styles.file} ref={fileRef} 
                        dangerouslySetInnerHTML={{ __html: file }}
                    ></div>
                </div>}
            <div className={styles.footer}>
                <div className={styles.left}>

                </div>
                <div className={styles.center}>
                    <input
                        type="range"
                        min="100"
                        max="200"
                        value={scaleFactor}
                        onChange={(event) => setScaleFactor(event.target.value)}
                    />
                </div>
                <div className={styles.right}>
                    
                </div>
            </div>
        </div>
    );
 };

export default Preview;
