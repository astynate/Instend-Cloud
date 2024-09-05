import styles from './main.module.css';
import arrow from './arrow.png';
import { useState } from 'react';

const Container = ({title, content=<></>, additionalContent=<></>}) => {
    const [isOpen, setOpenState] = useState(false);

    return (
        <div className={styles.container}>
            <div className={styles.header} onClick={() => setOpenState(prev => !prev)}>
                <span 
                    className={styles.title}
                >
                    {title}
                </span>
                <img 
                    src={arrow} 
                    className={styles.image} 
                    draggable="false" 
                    id={isOpen ? 'open' : null}
                />
            </div>
            {isOpen && (content)}
        </div>
    );
}

export default Container;