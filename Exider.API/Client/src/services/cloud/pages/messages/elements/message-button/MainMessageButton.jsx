import { useRef } from 'react';
import styles from './main.module.css';
import { ButtonEffectHandler } from '../../../../../../utils/ui/ButtonEffectHandler';

const MainMessageButton = ({image, callback = () => {}}) => {
    const ref = useRef();

    return (
        <button 
            ref={ref}
            className={styles.button} 
            onClick={(event) => {
                ButtonEffectHandler(ref, event);
                callback(event);
            }}
        >
            <img src={image} />
        </button>
    );
}

export default MainMessageButton;