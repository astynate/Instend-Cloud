import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import Loader from '../../../../shared/loader/Loader';

const PlayListPreview = ({id, name, time, cover, isSelected, isLoading}) => {
    return (
        <div className={styles.albumView} data={id}>
            <div className={styles.view}>
                {isLoading ? 
                    <div className={styles.cover}>
                        <Loader />
                    </div>
                :
                    <div className={styles.cover} id={isSelected ? 'selected' : null}>
                        <img 
                            src={cover ? `data:image/png;base64,${cover}` :  defaultCover} 
                            className={styles.cover}
                            draggable="false"
                        />
                        <div className={styles.buttonWrapper}>
                            <PlayButton 
                                callback={() => alert('!')}
                            />
                        </div>
                    </div>
                }
            </div>
            <div className={styles.description}>
                <span className={styles.title}>{name}</span>
                <span className={styles.time}>{time}</span>
            </div>
        </div>
    );
 };

export default PlayListPreview;