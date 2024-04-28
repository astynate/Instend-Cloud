import React, { useState, useRef, useEffect } from "react";
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

const Header = observer((props) => {
    const params = useParams();
    const createWindow = useRef();
    const [isCreateOpen, setCreationWindowState] = useState(false);
    const [isSortMenuOpen, setSortMenuState] = useState(false);
    const [sortMenuPosition, setSortMenuPosition] = useState([0, 60]);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);

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
                <Create isOpen={isCreateOpen} />
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