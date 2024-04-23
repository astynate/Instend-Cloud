import React from 'react';
import styles from './main.module.css';

const Photo = (props) => {
    if (props.file && props.file.fileAsBytes) {
        return (
            <div className={styles.photo}>
                <img 
                    src={`data:image/png;base64,${props.file.fileAsBytes}`} 
                    className={styles.image}
                    draggable={false}
                />
            </div>
        );
    }
 };

export default Photo;