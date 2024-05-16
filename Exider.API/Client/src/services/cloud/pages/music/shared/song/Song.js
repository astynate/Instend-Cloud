import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';

const Song = ({index, cover}) => {
  return (
        <div className={styles.song}>
            <div className={styles.name}>
                <span className={styles.index}>{index}</span>
                <div className={styles.albumCover}>
                    {cover ?
                        <img 
                            src={`data:image/png;base64,${cover}`} 
                            draggable="false" 
                        />
                    :
                    
                        <img 
                            src={defaultCover} 
                            className={styles.albumCoverImage} 
                            draggable="false" 
                        />
                    }    
                </div>
                <span className={styles.item}>Name</span>
            </div>
            <span className={styles.item}>{index}</span>
            <span className={styles.item}>0</span>
            <span className={styles.item}>Time</span>
        </div>
  )
}

export default Song;