import React from 'react';
import styles from './main.module.css';
import InformationItem from '../information-item/InformationItem';

const FileInformation = (props) => {
    return (
        <div className={styles.fileInformation}>
            <div className={styles.preview}>
                <img src={`data:image/png;base64,${props.file.fileAsBytes}`} />
            </div>
            <h1>General information</h1>
            <div className={styles.list}>
                {props.items && props.items.map && props.items.map((element, index) => {
                    return (
                        <InformationItem 
                            key={index}
                            title={element[0]} 
                            description={element[1]}
                        />
                    )
                })}
            </div>
        </div>
    );
 };

export default FileInformation;