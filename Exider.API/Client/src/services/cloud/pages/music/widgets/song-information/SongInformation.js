import React from 'react';
import styles from './main.module.css';
import defaultCover from './images/default-playlist-cover.png';
import PlayButton from '../../shared/ui-kit/play-button/PlayButton';
import BurgerMenu from '../../../../shared/ui-kit/burger-menu/BurgerMenu';

const SongInformation = (props) => {
  return (
        <div className={styles.songInformation}>
            <div className={styles.coverWrapper}>
                <div className={styles.effect}>
                    {props.cover ? 
                            <>
                            </>
                        :
                        
                            <img 
                                className={styles.coverImage}
                                src={defaultCover} 
                                draggable="false"
                            />
                        }
                </div>
                <div className={styles.cover}>
                    {props.cover ? 
                        <>
                        </>
                    :
                    
                        <img 
                            className={styles.coverImage}
                            src={defaultCover} 
                            draggable="false"
                        />
                    }
                </div>
            </div>
            <div className={styles.information}>
                <div className={styles.artist}>
                    <span>Исполнитель — Альбом</span>
                </div>
                <div className={styles.songName}>
                    <span>Не исполняется</span>
                </div>
                <div className={styles.playPanel}>
                    <PlayButton />
                    <BurgerMenu 
                        items={[
                            {'title': "I love Astynate =)"}
                        ]}
                    />
                </div>
            </div>
        </div>
  )
}

export default SongInformation;