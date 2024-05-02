import React, { useState, useRef, useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './styles/main.module.css';
import Button from "../../shared/button/Button";
import OpenAccess from './images/open-access.png';
import Download from './images/download.png';
import Upload from './images/upload.png';
import Sort from './images/sort.png';
import Create from "../../../../shared/create/Create";
import Next from './images/arrow.png';
import { instance } from "../../../../../../state/Interceptors";
import ContextMenu from "../../../../shared/context-menu/ContextMenu";
import OpenAccessProcess from "../../processes/OpenAccessProcess";
import { DownloadFromResponse } from "../../../../../../utils/DownloadFromResponse";
import { observer } from "mobx-react-lite";
import { AdaptId } from "../../../../../../states/storage-state";
import storageState from "../../../../../../states/storage-state";
import PopUpField from "../../../../shared/pop-up-filed/PopUpField";
import FileLoader from "../../../../shared/file-loader/FileLoader";
import excel from './images/types/excel.png';
import illustrator from './images/types/illustrator.png';
import newFolder from './images/types/new-folder.png';
import note from './images/types/note.png';
import photoshop from './images/types/photoshop.png';
import powerpoint from './images/types/powerpoint.png';
import upload from './images/types/upload.png';
import word from './images/types/word.png';
import { LayoutContext } from "../../../../layout/Layout";

export const sendFiles = async (event, folderId, setCount, setTotal) => {
    event.preventDefault();
  
    if (setCount && setTotal) {
        setCount(0);
        setTotal(event.target.files.length);
    }
  
    await Array.from(event.target.files).forEach(async (file) => {
      const files = new FormData();

      files.append('file', file);
      files.append('folderId', folderId ? folderId : "");

      await instance
        .post('/storage', files)
        .then(() => {
            if (setCount) {
                setCount((prev) => prev + 1);
            }
        })
        .catch((error) => {
          console.error(error);

          if (setCount && setTotal) {
            setCount(0);
            setTotal(0);
          }
        });
    });
};

const Header = observer((props) => {
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

    const params = useParams();
    const createWindow = useRef();
    const [isCreateOpen, setCreationWindowState] = useState(false);
    const [isSortMenuOpen, setSortMenuState] = useState(false);
    const [sortMenuPosition, setSortMenuPosition] = useState([0, 60]);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);
    const [type, setType] = useState(types.folder);
    const [isOpen, setOpenState] = useState(false);
    const [name, setName] = useState('');
    const [count, setCount] = useState(0);
    const [total, setTotal] = useState(0);
    const { Error } = useContext(LayoutContext);

    const OpenDialog = (current_type) => {
        setType(current_type);
        setOpenState(true);
        setName('');
    }

    const SortByNameAsending = () => {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    }
    
    const SortByNameDesending = () => {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
    }    

    const SortByDateAsending = () => {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );      
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );
    }    

    const SortByDateDesending = () => {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );      
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );
    }    

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createWindow.current && !createWindow.current.contains(event.target)) {
                setCreationWindowState(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            };
    }, []);

    return (
      <div className={styles.header}>
        {total !== count && <FileLoader count={count} total={total} />}
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
                }).catch(response => {
                    props.error('Attention!', response.data);
                });
              } else {
                formData.append("type", type.type);

                instance.post(`/file`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).catch(response => {
                    props.error('Attention!', response.data);
                });
              }
          }}
        />
        {isOpenAccessWindow === true ? <OpenAccessProcess
            id={params.id}
            close={() => setOpenAccessWindowState(false)}
        /> : null}
        <div className={styles.buttons}>
            <div className={styles.buttonBlock}>
                <Button 
                    img={OpenAccess} 
                    title="Open access" 
                    onClick={() => {
                        if (params.id) {
                            setOpenAccessWindowState(true)
                        } else {
                            props.error('🔒 Attention!', 'Due to possible security issues, you cannot share this directory.');
                        }
                    }}
                />
            </div>
            <div className={styles.buttonBlock}>
                <Button 
                    img={Upload} 
                    onClick={() => setCreationWindowState(prev => !prev)}
                    forwardRef={createWindow}
                />
                <div className={styles.create} id={isCreateOpen ? 'open' : null}>
                    <Create 
                        isOpen={isCreateOpen}
                        items={[
                            {image: newFolder, title: "Folder", callback: () => OpenDialog(types.folder)},
                            {image: upload, title: "Upload", callback: () => {}, type: "upload", sendFiles: (event) => sendFiles(event, params.id, setCount, setTotal)},
                            {image: note, title: "Note", callback: () => OpenDialog(types.txt)},
                            {image: word, title: "Word", callback: () => OpenDialog(types.docx)},
                            {image: excel, title: "Excel", callback: () => OpenDialog(types.xlsx)},
                            {image: powerpoint, title: "Powerpoint", callback: () => OpenDialog(types.pptx)},
                            {image: photoshop, title: "Photoshop", callback: () => OpenDialog(types.psd)},
                            {image: illustrator, title: "Illustrator", callback: () => OpenDialog(types.ai)}
                        ]}
                    />
                </div>
            </div>
            <div className={styles.buttonBlock}>
                <Button img={Download} title="Download" onClick={() => {
                    instance({
                        url: `/folders?id=${params.id || ''}`,
                        method: 'GET',
                        responseType: 'blob',
                    })
                    .then((response) => {
                        DownloadFromResponse(response)
                    });
                }}/>
                <Button 
                    img={Sort} 
                    title="Name" 
                    onClick={(event) => {
                        setSortMenuState(prev => !prev);
                        setSortMenuPosition([event.clientX, 90]);
                    }}
                />
            </div>
        </div>
        <div>
        {isSortMenuOpen === true ?
            <ContextMenu 
                items={[
                    [null, "Ascending by name", () => SortByNameAsending()],
                    [null, "Descending by name", () => SortByNameDesending()],
                    [null, "New ones first", () => SortByDateAsending()],
                    [null, "Old ones first", () => SortByDateDesending()]
                ]}
                position={sortMenuPosition}
                close={() => setSortMenuState(false)}
                isContextMenu={false}
            /> : null}
            {(props.path && props.path.length > 0) ?

                    <h1 className={styles.title}>{props.path[props.path.length - 1].name}</h1>
                :
                    <h1 className={styles.title}>Welcome back, {props.name}!</h1>  
            }
            <div className={styles.pathWrapper}>
                <Link to={`/cloud`} className={styles.folder}>
                    <span className={styles.path}>Cloud Storage</span>
                </Link>
                {props.path && props.path.map ? props.path.map((element, index) => (
                    <Link to={`/cloud/${element.id}`} className={styles.folder} key={index}>
                        <img src={Next} />
                        <span className={styles.path}>{element.name}</span>
                    </Link>
                )) : null}
            </div>
        </div>
      </div>
    )
  });
  
  export default Header;