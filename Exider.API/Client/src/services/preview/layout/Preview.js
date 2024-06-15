import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import PreviewHeader from '../widgets/header/Header';
import { instance } from '../../../state/Interceptors';
import { ConvertFullDate } from '../../../utils/DateHandler';
import { Placeholder } from 'reactstrap';
import { toJS } from 'mobx';
import right from './images/right.png';
import './document.css';

const Preview = ({close, files, index}) => {
    const [isLoading, setLoadingState] = useState(true);
    const [file, setFile] = useState(null);
    const [scaleFactor, setScaleFactor] = useState(100);
    const [currentIndex, setCurrentIndex] = useState(index);
    const [errorMessage, setErrorMessage] = useState(null);
    const fileRef = useRef();

    useEffect(() => {
        try {
            let firstChild = fileRef.current.querySelector('*');
            firstChild.style.transform = `scale(${scaleFactor}%)`;
        } catch { }
    }, [scaleFactor]);

    const UpdateIndex = (value) => {
        setCurrentIndex(prev => {
            const newIndex = (prev + value) % files.length;
            return newIndex < 0 ? files.length - 1 < 0 ? 0 : files.length - 1 : newIndex;
        })
    }    

    useEffect(() => {
        const GetFile = async () => {;
            const fileAsJs = toJS(files[currentIndex]);
            setLoadingState(true);

            if (fileAsJs && fileAsJs.strategy !== 'folder') {
                await instance
                    .get(`/file?id=${fileAsJs.id}`)
                    .then((response) => {
                        setFile(response.data);
                        setErrorMessage(null);
                        setLoadingState(false);
                    })
                    .catch((error) => {
                        setErrorMessage(error.response.data ? error.response.data : 'File type is not support');
                        setLoadingState(false);
                    });
            }
        };

        GetFile();
    }, [currentIndex]);

    return (
        <div className={styles.wrapper}>            
                <>
                    <div 
                        className={styles.navigateButton} 
                        onClick={() => UpdateIndex(-1)}
                    >
                        <img src={right} />
                    </div>
                    <div 
                        className={styles.navigateButton} 
                        id="right" 
                        onClick={() => UpdateIndex(1)}
                    >
                        <img src={right} />
                    </div>
                    <PreviewHeader 
                        name={files[currentIndex] ? files[currentIndex].name : 'File not select'}
                        time={files[currentIndex] ? ConvertFullDate(files[currentIndex].lastEditTime) : null}
                        close={close}
                        id={files[currentIndex] ? files[currentIndex].id : null}
                        error={() => {}}
                    />
                    {files[currentIndex] ? 
                        <>
                            {isLoading ?
                                <div className={styles.loader}></div>
                            :   
                                <div className={styles.preview}>
                                    {file && !errorMessage ? 
                                        <div 
                                            className={styles.file} ref={fileRef} 
                                            dangerouslySetInnerHTML={{ __html: file }}
                                        ></div>
                                    :
                                        <span className={styles.error}>{errorMessage}</span>
                                    }
                                </div>}
                        </>
                    :
                        <div className={styles.placeholder}>
                            <Placeholder title='No files selected' />
                        </div>
                    }
                </>
        </div>
    );
 };

export default Preview;
