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
import OpenAccessWindow from "../open-access/OpenAccess";
import OpenAccessProcess from "../../processes/OpenAccessProcess";

const Header = (props) => {
    const params = useParams();
    const createWindow = useRef();
    const [isCreateOpen, setCreationWindowState] = useState(false);
    const [isSortMenuOpen, setSortMenuState] = useState(false);
    const [sortMenuPosition, setSortMenuPosition] = useState([0, 60]);
    const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);

    const SortByNameAsending = () => {
        props.folders[1]((prev) => {
            return prev.slice().sort((a, b) => (a.props.name < b.props.name ? 1 : -1));
        });
        props.files[1]((prev) => {
            return prev.slice().sort((a, b) => (a.props.name < b.props.name ? 1 : -1));
        });
    }

    const SortByNameDesending = () => {
        props.folders[1]((prev) => {
            return prev.slice().sort((a, b) => (a.props.name > b.props.name ? 1 : -1));
        });
        props.files[1]((prev) => {
            return prev.slice().sort((a, b) => (a.props.name > b.props.name ? 1 : -1));
        });
    }

    const SortByDateAsending = () => {
        props.folders[1]((prev) => {
            return prev.slice().sort((a, b) => a.props.creationTime - b.props.creationTime);
        });
        props.files[1]((prev) => {
            return prev.slice().sort((a, b) => a.props.creationTime - b.props.creationTime);
        });
    }    

    const SortByDateDesending = () => {
        props.folders[1]((prev) => {
            return prev.slice().sort((a, b) => b.props.creationTime - a.props.creationTime);
        });
        props.files[1]((prev) => {
            return prev.slice().sort((a, b) => b.props.creationTime - a.props.creationTime);
        });
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
            close={() => setOpenAccessWindowState(false)}
        /> : null}
        <div className={styles.buttons}>
            <div className={styles.buttonBlock}>
                <Button 
                    img={OpenAccess} 
                    title="Open access" 
                    onClick={() => setOpenAccessWindowState(true)}
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
                        const url = window.URL.createObjectURL(new Blob([response.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        const contentDisposition = response.headers['content-disposition'];
                        let filename = 'default_filename.zip';
                        if (contentDisposition) {
                            const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                            let matches = filenameRegex.exec(contentDisposition);
                            if (matches != null && matches[1]) { 
                              filename = matches[1].replace(/['"]/g, '');
                            }
                        }
                        link.setAttribute('download', filename);
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
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
                {props.path.map((element, index) => (
                    <Link to={`/cloud/${element.id}`} className={styles.folder} key={index}>
                        <img src={Next} />
                        <span className={styles.path}>{element.name}</span>
                    </Link>
                ))}
            </div>
        </div>
      </div>
    )
  };
  
  export default Header;