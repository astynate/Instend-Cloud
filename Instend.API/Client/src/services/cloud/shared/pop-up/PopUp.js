import React, { useRef, useEffect } from "react";
import styles from './styles/main.module.css';

const PopUp = (props) => {
    const popupRef = useRef();

    const handleClickOutside = (e) => {
        if (popupRef.current && !props.caller.current.contains(e.target) && 
            !popupRef.current.contains(e.target)) {
            props.setState(false);
        }
    };
      
    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, []);

    if (props.state === true) {
        return (
            <div ref={popupRef} className={styles.popup}>
                {props.children}
            </div>
        );
    }
};

export default PopUp;