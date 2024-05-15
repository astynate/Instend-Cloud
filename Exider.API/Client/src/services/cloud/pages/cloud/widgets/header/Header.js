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
import OpenAccessProcess from "../../../../process/open-access/OpenAccessProcess";
import { DownloadFromResponse } from "../../../../../../utils/DownloadFromResponse";
import { observer } from "mobx-react-lite";
import storageState from "../../../../../../states/storage-state";
import PopUpField from "../../../../shared/pop-up-filed/PopUpField";
import excel from './images/types/excel.png';
import illustrator from './images/types/illustrator.png';
import newFolder from './images/types/new-folder.png';
import note from './images/types/note.png';
import photoshop from './images/types/photoshop.png';
import powerpoint from './images/types/powerpoint.png';
import upload from './images/types/upload.png';
import word from './images/types/word.png';
import { CreateFolder } from "../../api/FolderRequests";
import { CreateFile, SendFilesFromEvent, types } from "../../api/FileRequests";

const Header = observer((props) => {
    const params = useParams();
    const createWindow = useRef();
    const [isCreateOpen, setCreationWindowState] = useState(false);
    const [isSortMenuOpen, setSortMenuState] = useState(false);
    const [sortMenuPosition, setSortMenuPosition] = useState([0, 60]);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);
    const [type, setType] = useState(types.folder);
    const [isOpen, setOpenState] = useState(false);
    const [name, setName] = useState('');

    const OpenDialog = (current_type) => {
        setType(current_type);
        setOpenState(true);
        setName('');
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
            <PopUpField 
                title={type.title}
                text={type.text}
                field={[name, setName]}
                placeholder={type.placeholder}
                close={() => setOpenState(false)}
                open={isOpen}
                callback={async () => {
                    if (name === null || name === '') 
                        return;

                    if (type.type === 'folder') {
                        CreateFolder(name, params.id);
                    } else {
                        CreateFile(name, type.type, params.id);
                    }
                }}
            />
            {isOpenAccessWindow === true && 
                <OpenAccessProcess
                    id={params.id}
                    close={() => setOpenAccessWindowState(false)}
                    endPoint={'folders-access'}
                />}
            <div className={styles.buttons}>
                <div className={styles.buttonBlock}>
                    <Button 
                        img={OpenAccess} 
                        title="Open access" 
                        onClick={() => {
                            if (params.id) {
                                setOpenAccessWindowState(true)
                            } else {
                                Error('🔒 Attention!', 'Due to possible security issues, you cannot share this directory.');
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
                                {image: upload, title: "Upload", callback: () => {}, type: "upload", sendFiles: (event) => SendFilesFromEvent(event, params.id)},
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
                    {props.isMobile === false &&<Button 
                        img={Sort} 
                        title="Name" 
                        onClick={(event) => {
                            setSortMenuState(prev => !prev);
                            setSortMenuPosition([event.clientX, 90]);
                        }}
                    />}
                </div>
            </div>
            <div>
            {isSortMenuOpen === true ?
                <ContextMenu 
                    items={[
                        [null, "Ascending by name", () => storageState.SortByNameAsending(params.id)],
                        [null, "Descending by name", () => storageState.SortByNameDesending(params.id)],
                        [null, "New ones first", () => storageState.SortByDateAsending(params.id)],
                        [null, "Old ones first", () => storageState.SortByDateDesending(params.id)]
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
                        <span className={styles.path}>Yexider Cloud</span>
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