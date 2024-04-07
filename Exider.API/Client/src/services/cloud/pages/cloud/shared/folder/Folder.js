import React, { useEffect, useState } from 'react';
import styles from './main.module.css';
import { Link } from 'react-router-dom';

const Folder = (props) => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles(Array.from({ length: 4 }).map((_, index) => {return (
      <div className={styles.file} key={index}>
        {props.folder.preview && props.folder.preview[index] ?
          <div className={styles.filePreview}>
            {props.folder.preview[index].fileAsBytes ? 
              <img src={`data:image/png;base64,${props.folder.preview[index].fileAsBytes}`} />
            : <span>{props.folder.preview[index].type}</span>}
          </div>
        : null}
      </div>
    )}));
  }, [props.folder])

  return (
    <Link to={`/cloud/${props.id}`}>
      <div className={styles.wrapper} onContextMenu={props.onContextMenu}>
        <div className={styles.content}>
          {(files)}
        </div>
        <div className={styles.description}>
          <span className={styles.name}>{props.name}</span>
          <span className={styles.time}>{props.time}</span>
        </div>
      </div>
    </Link>
  );
};

export default Folder;