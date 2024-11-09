import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import add from './Add.png';
import Create from '../../create/Create';

const AddButton = (props) => {
    const createWindow = useRef();
    const [isCreateOpen, setOpenState] = useState(false);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (createWindow.current && !createWindow.current.contains(event.target)) {
                setOpenState(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            };
    }, []);

    return (
        <div className={styles.add}>
            <Create
                isOpen={isCreateOpen}
                items={props.items}
            />
            <div className={styles.button} onClick={() => setOpenState(prev => !prev)} ref={createWindow}>
                <img 
                    src={add} 
                    draggable="false" 
                />
            </div>
        </div>
    );
 };

export default AddButton;