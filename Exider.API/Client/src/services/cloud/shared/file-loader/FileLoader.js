import React, { useEffect, useRef } from 'react';
import styles from './main.module.css';
import close from './close.png';

const FileLoader = (props) => {
  const line = useRef(null);

  useEffect(() => {
    line.current.style.width = `${100 * props.count / props.total}%`;
  }, [props.count, props.total]);

  return (
    <>
      <div className={styles.wrapper}>
        <div className={styles.loader}></div>
        <span>{props.count} Files left...</span>
        <img src={close} className={styles.close} alt="Close" />
      </div>
      <div className={styles.progressBar}>
        <div className={styles.line} ref={line}></div>
      </div>
    </>
  );
};

export default FileLoader;
