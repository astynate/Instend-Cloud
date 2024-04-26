import React from 'react';
import styles from './styles/main.module.css';
import CreateFolder from './images/new-folder.png';
import Upload from './images/upload.png';
import Note from './images/note.png';
import Excel from './images/excel.png';
import Word from './images/word.png';
import Photoshop from './images/photoshop.png';
import illustrator from './images/illustrator.png';
import Powerpoint from './images/powerpoint.png';
import { useState } from 'react';
import { instance } from '../../../../state/Interceptors';
import { useParams } from 'react-router-dom';
import FileLoader from '../file-loader/FileLoader';
import PopUpField from '../pop-up-filed/PopUpField';

const Create = (props) => {
    const params = useParams();
    const [name, setName] = useState('');

    const types = {
        "folder": {
            title: "Create folder",
            text: "Name is required",
            placeholder: "Folder name",
            type: "folder"
        },
        "txt": {
            title: "Create note",
            text: "Name is required",
            placeholder: "Note name",
            type: "txt"
        },
        "docx": {
            title: "Create Word Document",
            text: "Name is required",
            placeholder: "Document name",
            type: "docx"
        },
        "xlsx": {
            title: "Create Excel Table",
            text: "Name is required",
            placeholder: "Table name",
            type: "xlsx"
        },
        "pptx": {
            title: "Create Powerpoint Presentation",
            text: "Name is required",
            placeholder: "Presentation name",
            type: "pptx"
        },
        "psd": {
            title: "Create Phoshop file",
            text: "Name is required",
            placeholder: "File name",
            type: "psd"
        },
        "ai": {
            title: "Create Illustrator file",
            text: "Name is required",
            placeholder: "File name",
            type: "ai"
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

    const sendFiles = async (event) => {
        event.preventDefault();
      
        setCount(0);
        setTotal(event.target.files.length);
      
        await Array.from(event.target.files).forEach(async (file) => {
          const files = new FormData();

          files.append('file', file);
          files.append('folderId', params.id ? params.id : "");

          await instance
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
            <PopUpField 
                title={type.title}
                text={type.text}
                field={[name, setName]}
                placeholder={type.placeholder}
                close={() => setOpenState(false)}
                open={isOpen}
                callback={() => {
                    if (name === null || name === '') 
                        return;
                    
                    let formData = new FormData();
                    
                    formData.append("folderId", params.id ? params.id : "");
                    formData.append("name", name);

                    if (type.type === 'folder') {
                        instance.post(`/folders`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    } else {
                        formData.append("type", type.type);

                        instance.post(`/file`, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        });
                    }
                }}
            />
            <div className={styles.wrapper} id={props.isOpen ? 'open' : null}>
                <div className={styles.item} onClick={() => OpenDialog(types.folder)}>
                    <img src={CreateFolder} draggable="false" />
                    <span>Folder</span>
                </div>
                <div className={styles.item}>
                    <input 
                        type="file" 
                        onInput={async (event) => await sendFiles(event)}
                        multiple
                    />
                    <img src={Upload} draggable="false" />
                    <span>Upload</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.txt)}>
                    <img src={Note} />
                    <span>Note</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.docx)}>
                <img src={Word} draggable="false" />
                <span>Word</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.xlsx)}>
                    <img src={Excel} draggable="false" />
                    <span>Excel</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.pptx)}>
                    <img src={Powerpoint} draggable="false" />
                    <span>Powerpoint</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.psd)}>
                    <img src={Photoshop} draggable="false" />
                    <span>Photoshop</span>
                </div>
                <div className={styles.item} onClick={() => OpenDialog(types.ai)}>
                    <img src={illustrator} draggable="false" />
                    <span>Illustrator</span>
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