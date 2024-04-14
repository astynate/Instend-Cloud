import React, { useEffect, useState, useRef } from 'react';
import styles from './main.module.css';
import open from './images/open.png';

const Select = (props) => {
    const [isOpen, setOpenState] = useState(false);
    const [current, setCurrent] = useState(0);
    const node = useRef();

    const handleClickOutside = e => {
        if (node.current.contains(e.target) === false) {
            setOpenState(false);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={styles.select} ref={node}>
            <div className={styles.current} onClick={() => setOpenState(!isOpen)}>
                <span>{props.items[current]}</span>
                <img src={open} />
            </div>
            {isOpen ?
                <div className={styles.all} onClick={() => setOpenState(false)}>
                    {props.items.map((item, index) => 
                        (<span key={index} onClick={() => setCurrent(index)}>{item}</span>)
                    )}
                </div>
            : null}
        </div>
    );
};

export default Select;
