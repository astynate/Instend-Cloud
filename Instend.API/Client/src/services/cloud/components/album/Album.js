import React from 'react';
import { Link } from 'react-router-dom';
import { ConvertFullDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';

const Album = (props) => {
    return (
        <>
            {props.album.isLoading === true ?
                <div className={styles.album} id="loading">
                    <div className={styles.coverWrapper}>
                        <div className={styles.cover}>
                        </div>
                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>{props.album.name}</span>
                        <span>Loading</span>
                    </div>
                </div>
            :
                <Link to={`/gallery/albums/${props.album.id}`} className={styles.album} data={props.album.id}>
                    <div>
                        <img 
                            src={`data:image/png;base64,${props.album.cover}`} 
                            className={styles.cover}
                            draggable="false"
                            id={props.isSelected ? 'selected' : null}
                        />
                    </div>
                    <div className={styles.information}>
                        <span className={styles.name}>{props.album.name}</span>
                        <span>{ConvertFullDate(props.album.creationTime)}</span>
                    </div>
                </Link>
            }
        </>
    );
 };

export default Album;