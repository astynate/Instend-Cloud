import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import upload from "./images/upload.png";
import PopUpWindow from '../../../../shared/pop-up-window/PopUpWindow';
import Button from '../../../../shared/ui-kit/button/Button';
import Input from '../../../../shared/ui-kit/input/Input';
import { instance } from '../../../../../../state/Interceptors';
import applicationState from '../../../../../../states/application-state';

const EditSong = (props) => {
    const [title, setTitle] = useState(props.song && props.song.title ? props.song.title : '');
    const [artist, setArtist] = useState(props.song && props.song.artist ? props.song.artist : '');
    const [album, setAlbum] = useState(props.song && props.song.album ? props.song.album : '');
    const [image, setImage] = useState(null);
    const [imageAsURL, setImageAsURL] = useState(null);

    const UpdateSongRequest = async (song) => {
        if (song && song.id) {
            let form = new FormData();
    
            form.append('file', image);
            form.append('id', song.id);
            form.append('title', title);
            form.append('artist', artist);
            form.append('album', album);
    
            await instance
                .put('/api/music/song', form)
                .catch((error) => {
                    applicationState.AddErrorInQueue('Attention!', 'Something went wrong.');
                })
        }
    }

    const handleImageUpload = (event) => {
        try {
            const file = event.target.files[0];
            const reader = new FileReader();
    
            reader.onloadend = () => {
                setImage(file);
                setImageAsURL(reader.result);
            };
    
            reader.readAsDataURL(file);
        } catch {}
    };

    return (
        <PopUpWindow
            open={props.open} 
            close={props.close}
            isHeaderPositionAbsulute={true}
        >
            <div className={styles.createAlbum}>
                <div className={styles.header}>
                    <span>{'Edit song'}</span>
                </div>
                <div className={styles.content}>
                    <div className={styles.left}>
                        <div className={styles.loadCover}>
                            {image ? (
                                <img src={imageAsURL} className={styles.uploadedImage} />
                            ) : props.song && props.song.fileAsBytes ? 
                                <img src={`data:image/png;base64,${props.song && props.song.fileAsBytes}`} className={styles.uploadedImage} />
                            :
                                <img src={upload} className={styles.upload} />
                            }
                            <input type='file' onChange={handleImageUpload} accept='image/*' />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <div className={styles.field}>
                            <span>Title</span>
                            <Input 
                                placeholder="Song title"
                                value={title}
                                setValue={setTitle} 
                            />
                        </div>
                        <div className={styles.field}>
                            <span>Artist</span>
                            <Input 
                                placeholder="Artist name"
                                value={artist}
                                setValue={setArtist} 
                            />
                        </div>
                        <div className={styles.field}>
                            <span>Album</span>
                            <Input 
                                placeholder="Album name"
                                value={album}
                                setValue={setAlbum} 
                            />
                        </div>
                        <div className={styles.buttonWrapper}>
                            <Button 
                                value={"Coninue"} 
                                callback={() => {
                                    UpdateSongRequest(props.song);
                                    props.close();
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </PopUpWindow>
    );
 };

export default EditSong;