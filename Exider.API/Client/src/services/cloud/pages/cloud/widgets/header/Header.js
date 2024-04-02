import React, { useState, useRef, useEffect } from "react";
import styles from './styles/main.module.css';
import Button from "../../shared/button/Button";
import OpenAccess from './images/open-access.png';
import Download from './images/download.png';
import Upload from './images/upload.png';
import Sort from './images/sort.png';
import Create from "../../../../shared/create/Create";

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
            <h1 className={styles.title}>Welcome back, {props.name}!</h1>
            <span className={styles.path}>Cloud Storage</span>
        </div>
      </div>
    )
  };
  
  export default Header;