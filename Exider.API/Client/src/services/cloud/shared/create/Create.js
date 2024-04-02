import React, { useEffect } from 'react';
import styles from './styles/main.module.css';
import CreateFolder from './images/new-folder.png';
import Upload from './images/upload.png';
import Note from './images/note.png';
import { useState } from 'react';
import { instance } from '../../../../state/Interceptors';
import { useParams } from 'react-router-dom';
import FileLoader from '../file-loader/FileLoader';

const Create = (props) => {
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const id = {useParams}

    const sendFiles = (event) => {
        event.preventDefault();
      
        setCount(0);
        setTotal(event.target.files.length);
      
        Array.from(event.target.files).forEach((file) => {
          const files = new FormData();
          files.append('file', file);
          instance
            .post('/storage', files, id)
            .then((response) => {
              setCount((prev) => prev + 1);
            })
            .catch((error) => {
              console.error(error);
              setCount(0);
              setTotal(0);
            });
        });
    };      

    return (
        <div>
            <div className={styles.wrapper} id={props.isOpen ? 'open' : 'close'}>
                <div className={styles.item}>
                    <img src={CreateFolder} />
                </div>
                <div className={styles.item}>
                    <input 
                        type="file" 
                        onInput={(event) => sendFiles(event)}
                        multiple
                    />
                    <img src={Upload} />
                </div>
                <div className={styles.item}>
                    <img src={Note} />
                </div>
                <div className={styles.item}>

                </div>
                <div className={styles.item}>

                </div>
                <div className={styles.item}>

                </div>
                <div className={styles.item}>
                </div>
                <div className={styles.item}>

                </div>
            </div>
            {
                total !== count ? 
                    <FileLoader count={count} total={total} /> 
                : null
            }
        </div>
    );
 };

export default Create;