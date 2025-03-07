import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import add from './Add.png';
import CreateItemsListPopUp from '../../../features/pop-up-windows/create-items-list-popup/CreateItemsListPopUp';

const AddButton = ({items}) => {
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
            <CreateItemsListPopUp
                isOpen={isCreateOpen}
                items={items}
            />
            <div 
                className={styles.button} 
                onClick={() => setOpenState(prev => !prev)} 
                ref={createWindow}
            >
                <img src={add} draggable="false" />
            </div>
        </div>
    );
};

export default AddButton;