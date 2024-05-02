import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import add from './images/main/add.png';
import Create from '../../../../shared/create/Create';
import album from './images/types/album.png';
import image from './images/types/image.png';
import { sendFiles } from '../../../cloud/widgets/header/Header';
import { useParams } from 'react-router-dom';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';

const Add = () => {
    const params = useParams();
    const createWindow = useRef();
    const [isCreateOpen, setOpenState] = useState(false);
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);

    const AddFile = (event, id) => {
        if (id === null || id === undefined) {
            sendFiles(event, id, null, null);
        }
    }

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
            {isCreateAlbumOpen && <CreateAlbum 
                open={isCreateAlbumOpen}
                close={() => {setCreateAlbumOpen(false)}}
            />}
            <Create 
                isOpen={isCreateOpen}
                items={[
                    {image: album, title: "Album", callback: () => {setCreateAlbumOpen(true)}},
                    {image: image, title: "Image", callback: () => {}, type: "upload", sendFiles: (event) => AddFile(event, params.id)},
                ]}
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

export default Add;