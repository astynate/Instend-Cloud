import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from './styles/main.module.css';
import Button from "../../shared/button/Button";
import OpenAccess from './images/open-access.png';
import Download from './images/download.png';
import Upload from './images/upload.png';
import Sort from './images/sort.png';
import Create from "../../../../shared/create/Create";
import Next from './images/arrow.png';

const Header = (props) => {
    const [isCreateOpen, setCreationWindowState] = useState(false);
    const createWindow = useRef();

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
        <div className={styles.buttons}>
            <div className={styles.buttonBlock}>
                <Button img={OpenAccess} title="Open access" />
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
                <Button img={Download} title="Download" />
                <Button img={Sort} title="Name" />
            </div>
        </div>
        <div>
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