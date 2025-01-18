import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import system from './images/gear.png';
import PointsLoaderAnimation from '../../shared/animations/points-loader-animation/PointsLoaderAnimation';

const Collection = ({collection = {}, onContextMenu = () => {}, callback = () => {}, setSelectedFolders = () => {}}) => {
    const [files, setFiles] = useState([]);
    const [isSelected, setSelectedState] = useState(false);

    useEffect(() => {
      if (collection && !collection.isLoading) {
        setFiles(Array.from({ length: 4 }).map((_, index) => {return (
          <div className={styles.file} key={index}>
          </div>
        )}));
      }
    }, [collection]);

    if (collection.isLoading) {
        return (
          <div className={styles.wrapper} onContextMenu={onContextMenu}>
            <div className={styles.content} id='loading'>
              {Array.from({ length: 4 }).map((_, index) => {
                  return (
                    <div className={styles.file} key={index}></div>
                )})
              }
            </div>
            <div className={styles.description}>
              <div className={styles.nameWrapper}>
                <span className={styles.name}>{collection.name ? collection.name : "Unknown"}</span>
              </div>
              <div style={{marginTop: '17px'}}>
                <PointsLoaderAnimation 
                  size='5px' 
                  gap='7px' 
                />
              </div>
            </div>
          </div> 
        );
    };
    
    return (
      <Link to={`/cloud/${collection.id}`} data={collection.id}>
        <div 
          className={styles.wrapper} 
          id={isSelected === true ? 'selected' : null} 
          onContextMenu={onContextMenu}
        >
          <div className={styles.content} onClick={callback}>
            {(files)}
          </div>
          <div className={styles.description}>
            <div className={styles.nameWrapper}>
              {collection.typeId === 'System' && <img src={system} className={styles.folderType} />}
              <span className={styles.name}>{collection.name}</span>
            </div>
            <span className={styles.time}>{ConvertDate(collection.creationTime)}</span>
          </div>
        </div>
      </Link>
    );
};

export default Collection;