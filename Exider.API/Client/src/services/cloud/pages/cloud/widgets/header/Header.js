import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import styles from './styles/main.module.css';
import Button from "../../shared/button/Button";
import OpenAccess from './images/open-access.png';
import Download from './images/download.png';
import Sort from './images/sort.png';
import Next from './images/arrow.png';
import { instance } from "../../../../../../state/Interceptors";
import ContextMenu from "../../../../shared/context-menu/ContextMenu";
import OpenAccessProcess from "../../../../process/open-access/OpenAccessProcess";
import { DownloadFromResponse } from "../../../../../../utils/DownloadFromResponse";
import { observer } from "mobx-react-lite";
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
import Menu from "../../../../widgets/menu/Menu";
import Add from "../../../../shared/ui-kit/add/Add";
import storageState from "../../../../../../states/storage-state";

const Header = observer((props) => {
    const params = useParams();
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

    const GetTrashFolderId = () => {
        if (storageState.folders) {
            const folder = Object.values(storageState.folders).flat()
                .find(element => (element.name && element.typeId) ? element.name === 'Trash' && element.typeId === 'System' : null);

            if (folder && folder.id) {
                return folder.id;
            }
        }

        return null;
    }

    return (
        <>
            <div className={styles.header}>
                {isOpenAccessWindow === true && 
                    <OpenAccessProcess
                        id={params.id}
                        open={isOpenAccessWindow}
                        close={() => setOpenAccessWindowState(false)}
                        endPoint={'folders-access'}
                        accessSaveCallback={() => {}}
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
                        <Menu
                            items={[
                                {
                                    'name': 'All', 
                                    'route': `/cloud${params['id'] ? '/' + params['id'] : ''}`
                                }, 
                                {
                                    'name': 'Collections', 
                                    'route': `/cloud/collections${params['id'] ? '/' + params['id'] : ''}`
                                },
                                {
                                    'name': 'Files', 
                                    'route': `/cloud/files${params['id'] ? '/' + params['id'] : ''}`
                                }, 
                                GetTrashFolderId() ? {
                                    'name': 'Trash', 
                                    'route': `/cloud/${GetTrashFolderId()}`
                                } : null,
                            ]}
                        />
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
                            [null, "Ascending by name", () => {props.setSortingType(0); setSortMenuState(false);} ],
                            [null, "Descending by name", () => {props.setSortingType(1); setSortMenuState(false);}],
                            [null, "New ones first", () => {props.setSortingType(2); setSortMenuState(false);}],
                            [null, "Old ones first", () => {props.setSortingType(3); setSortMenuState(false);}]
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
            </div>
            <Add
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
        </>
    )
  });
  
  export default Header;