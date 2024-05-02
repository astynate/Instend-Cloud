import React from 'react';
import styles from './main.module.css';
import { ConvertDate, ConvertFullDate } from '../../../../../../utils/DateHandler';
import { Link } from 'react-router-dom';

const Album = (props) => {
    return (
        <Link to={`/gallery/albums/${props.album.id}`} className={styles.album}>
            <div>
                <img 
                    src={`data:image/png;base64,${props.album.cover}`} 
                    className={styles.cover}
                    draggable="false"
                />
            </div>
            <div className={styles.information}>
                <span className={styles.name}>{props.album.name}</span>
                <span>{ConvertFullDate(props.album.creationTime)}</span>
            </div>
        </Link>
    );
 };

export default Album;