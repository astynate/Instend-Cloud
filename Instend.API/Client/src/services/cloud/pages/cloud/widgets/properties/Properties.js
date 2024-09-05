import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';
import image from './images/folder.png';
import { ConvertFullDate } from '../../../../../../utils/DateHandler';

const PropertiesWindow = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapper = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
          if (wrapper.current && !wrapper.current.contains(event.target)) {
            if (isOpen) {
              props.close();
              setIsOpen(false);
            }
          }
          setIsOpen(true);
        };
    
        document.addEventListener('click', handleClickOutside);
        
        return () => {
          document.removeEventListener('click', handleClickOutside);
        };
    
      }, [isOpen]);

    if (props.file) {

        return (
            <div className={styles.wrapper} ref={wrapper}>
                <div className={styles.imageWrapper}>
                    <img src={image} className={styles.image} draggable={false} />
                </div>
                <div className={styles.nameWrapper}>
                    <span className={styles.name}>{props.file.name}</span>
                    <span className={styles.time}>{ConvertFullDate(props.file.creationTime)}</span>
                </div>
                {props.items ? 
                    props.items.map((element, index) => {
                        return (
                            <div className={styles.item} key={index}>
                                <span className={styles.key}>{element.key}</span>
                                <span className={styles.value}>{element.value}</span>
                            </div>
                        );
                    })
                : null}
            </div>
        );

    }

};

export default PropertiesWindow;