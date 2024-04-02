import React, { useEffect, useRef, useState } from 'react';
import styles from './main.module.css';

const PopUpField = (props) => {
  const wrapper = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

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

  return (
    <div className={styles.wrapper} ref={wrapper}>
      <h1>{props.title}</h1>
      <span>{props.text}</span>
      <input 
        defaultValue={props.field[0]}
        onInput={(event) => props.field[1](event.target.value)}
        maxLength={50} 
        minLength={1}
      />
      <button onClick={() => {
        props.callback();
        props.close();
      }}>Next</button>
    </div>
  );
};

export default PopUpField;
