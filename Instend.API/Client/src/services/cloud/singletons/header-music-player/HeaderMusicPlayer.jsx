import { useState } from 'react';
import SimpleRange from '../../ui-kit/ranges/simple-range/SimpleRange';
import styles from './main.module.css';
import play from './images/play.png';
import pause from './images/pause.png';
import next from './images/next.png';
import repeat from './images/repeat.png';
import sound from './images/sound.png';

const HeaderMusicPlayer = () => {
    const [value, setValue] = useState(0);

    return (
        <div className={styles.wrapper}>
            <div className={styles.control}>
                <div className={styles.top}>
                    <div className={styles.songCover}>

                    </div>
                    <div className={styles.information}>
                        <span className={styles.title}>Kill This Love</span>
                        <span className={styles.artist}>BLACKPINK</span>
                    </div>
                </div>
                <div className={styles.bottom}>
                    <div className={styles.range}>
                        <span>0:30</span>
                        <SimpleRange 
                            step={1}
                            minValue={0}
                            maxValue={100}
                            value={value} 
                            setValue={setValue} 
                            loadPercentage={1} 
                            isActive={true}
                        />
                        <span>3:30</span>
                    </div>
                    <div className={styles.controlButtons}>
                        <div className={styles.left}>
                            <img 
                                className={styles.button} 
                                src={sound} 
                                draggable="false" 
                            />
                        </div>
                        <div className={styles.center}>
                            <img 
                                className={styles.button} 
                                src={next} 
                                draggable="false" 
                            />
                            <img 
                                className={styles.button} 
                                src={play} 
                                draggable="false" 
                            />
                            <img 
                                className={styles.button} 
                                src={next} 
                                draggable="false" 
                            />
                        </div>
                        <div className={styles.right}>
                            <img 
                                className={styles.button} 
                                src={repeat} 
                                draggable="false" 
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.songs}>

            </div>
        </div>
    );
}

export default HeaderMusicPlayer;