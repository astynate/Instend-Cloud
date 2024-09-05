import { useContext, useEffect, useRef } from 'react';
import { ProfileSettingsContext } from '../../pages/profile/Profile';
import external_styles from '../setting/styles/main.module.css';
import styles from './main.module.css';

const Input = (props) => {

    const [context, setContext] = useContext(ProfileSettingsContext);

    return (

        <div className={external_styles.setting} id={props.type}>
            <span className={styles.placeholder}>{props.title}</span>
            <input 
                defaultValue={props.defaultValue}
                value={props.value}
                className={styles.input} 
                onChange={(event) => props.setValue(event.target.value, setContext)}
                ref={props.forwardRef}
                maxLength={props.maxLength}
            />
        </div>
        
    );

};

export default Input;