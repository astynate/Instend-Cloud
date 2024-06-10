import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PreviewHeader from '../widgets/header/Header';
import { instance } from '../../../state/Interceptors';
import { ConvertFullDate } from '../../../utils/DateHandler';
import { Placeholder } from 'reactstrap';
import { toJS } from 'mobx';

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
        const GetFile = async () => {;
            const fileAsJs = toJS(props.file);

            if (fileAsJs && fileAsJs.strategy !== 'folder') {
                await instance
                    .get(`/file?id=${fileAsJs.id}`)
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
    }, [props, props.file]);

    return (
        <div className={styles.wrapper}>            
                <>
                    <PreviewHeader 
                        name={props.file ? props.file.name : 'File not select'}
                        time={props.file ? ConvertFullDate(props.file.lastEditTime) : null}
                        close={props.close}
                        id={props.file ? props.file.id : null}
                        error={props.ErrorMessage}
                    />
                    {props.file ? 
                        <>
                            {isLoading ?
                                <div className={styles.loader}></div>
                            :   
                                <div className={styles.preview}>
                                    <div 
                                        className={styles.file} ref={fileRef} 
                                        dangerouslySetInnerHTML={{ __html: file }}
                                    ></div>
                                </div>}
                            {/* <div className={styles.footer}>
                                <div className={styles.left}>

                                </div>
                                <div className={styles.center}>
                                </div>
                            </div> */}
                        </>
                    :
                        <Placeholder title='No files selected' />
                    }
                </>
        </div>
    );
 };

export default Preview;
