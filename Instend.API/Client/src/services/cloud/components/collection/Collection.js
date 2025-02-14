import React from 'react';
import { Link } from 'react-router-dom';
import styles from './main.module.css';
import StorageItemDescription from '../../features/storage/storage-item-description/StorageItemDescription';

const Collection = ({collection = {}, onContextMenu = () => {}, callback = () => {}, isHasLink = true}) => {
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
            <StorageItemDescription name={collection.name} />
          </div> 
        );
    };
    
    return (
      <Link to={isHasLink ? `/cloud/${collection.id}` : ''}>
        <div className={styles.wrapper} onContextMenu={onContextMenu}>
          <div className={styles.content} onClick={callback}>
            {Array.from({ length: 4 }).map((_, index) => {
                return (
                  <div className={styles.file} key={index}>
                  </div>
                )
              }
            )}
          </div>
          <StorageItemDescription
            name={collection.name} 
            time={collection.creationTime}
          />
        </div>
      </Link>
    );
};

export default Collection;