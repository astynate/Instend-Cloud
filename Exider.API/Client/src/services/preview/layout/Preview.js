import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import PreviewHeader from '../widgets/header/Header';
import Scale from '../shared/scale/Scale';
import { instance } from '../../../state/Interceptors';
import { ConvertFullDate } from '../../../utils/DateHandler';

const Preview = (props) => {
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
                props.close();
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
            />
            {isLoading ?
                <div className={styles.loader}></div>
            :   
                <div className={styles.preview}>
                    <div className={styles.file} dangerouslySetInnerHTML={{ __html: file }}>
                    </div>
                </div>}
        </div>
    );
 };

export default Preview;
