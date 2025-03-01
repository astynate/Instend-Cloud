import { useRef } from 'react';
import { ButtonEffectHandler } from '../../../../../../handlers/ButtonEffectHandler';
import styles from './main.module.css';

const MainMessageButton = ({
        image,
        isInverted = true,
        callback = () => {}, 
        onMouseEnter = () => {},
        onMouseLeave = () => {},
    }) => {
    
    const ref = useRef();

    return (
        <button 
            ref={ref}
            className={styles.button} 
            onClick={(event) => {
                ButtonEffectHandler(ref, event);
                callback(event);
            }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            invertedstate={isInverted ? 'inverted' : 'not-inverted'}
        >
            <img src={image} draggable="false" />
        </button>
    );
};

export default MainMessageButton;