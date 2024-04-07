import React, { useEffect } from 'react';
import styles from './styles/main.module.css';
import CreateFolder from './images/new-folder.png';
import Upload from './images/upload.png';
import Note from './images/note.png';
import { useState } from 'react';
import { instance } from '../../../../state/Interceptors';
import { useParams } from 'react-router-dom';
import FileLoader from '../file-loader/FileLoader';
import PopUpField from '../pop-up-filed/PopUpField';

const Create = (props) => {
    const params = useParams();
    const [name, setName] = useState('');

    const FolderCallback = () => {
        if (name === null || name === '') 
            return;
        
        let formData = new FormData();
        
        formData.append("folderId", params.id ? params.id : "");
        formData.append("name", name);

        instance.post(`/folders`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    const types = {
        "folder": {
            title: "Create folder",
            text: "Please enter name",
            placeholder: "Folder name",
            callback: FolderCallback
        }
    }

    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const [type, setType] = useState(types.folder);
    const [isOpen, setOpenState] = useState(false);

    const OpenDialog = (type) => {
        setType(type);
        setOpenState(true);
        setName('');
    }

    const sendFiles = (event) => {
        event.preventDefault();
      
        setCount(0);
        setTotal(event.target.files.length);
      
        Array.from(event.target.files).forEach((file) => {
          const files = new FormData();

          files.append('file', file);
          files.append('folderId', params.id ? params.id : "");

          instance
            .post('/storage', files, params)
            .then(() => {
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
            {isOpen === true ?
                <PopUpField 
                    title={type.title}
                    text={type.text}
                    field={[name, setName]}
                    placeholder={type.placeholder}
                    close={() => setOpenState(false)}
                    callback={() => {
                        if (name === null || name === '') 
                            return;
                        
                        let formData = new FormData();
                        
                        formData.append("folderId", params.id ? params.id : "");
                        formData.append("name", name);
                
                        instance.post(`/folders`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }}
            /> : null}
            <div className={styles.wrapper} id={props.isOpen ? 'open' : 'close'}>
                <div className={styles.item} onClick={() => OpenDialog(types.folder)}>
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