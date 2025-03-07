import React, { useLayoutEffect, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import { ConvertDate } from '../../../../handlers/DateHandler';
import styles from './main.module.css';
import StorageItemDescription from '../../features/storage/storage-item-description/StorageItemDescription';
import GlobalContext from '../../../../global/GlobalContext';
import StorageController from '../../../../api/StorageController';
import StorageItemWrapper from '../../features/wrappers/storage-item-wrapper/StorageItemWrapper';

const File = ({isLoading, file}) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [image, setImage] = useState(undefined);
  const [isSelected, setSelectedState] = useState(false);
  const [isSelectedOpen, setSelectedOpenState] = useState(false);

  useLayoutEffect(() => { 
    if (GlobalContext.supportedImageTypes.includes(file.type)) {
      var img = new Image();

      img.onload = function() {
        var width = this.naturalWidth;
        var height = this.naturalHeight;
  
        setAspectRatio(height / width);
        setImage(StorageController.getFullFileURL(file.path));
      };
  
      img.src = StorageController.getFullFileURL(file.path);
    };
  }, [image]);
  
  if (isLoading === true) {
    return (
      <StorageItemWrapper>
        <div className={styles.wrapper}>
          <div className={styles.content}>
              <div className={styles.file} id="loading">
                <div className={styles.loader}>
                  <CircularProgress 
                    value={file && file.perscentage !== undefined && file.perscentage !== null ? file.perscentage : 20}
                    sx={{
                      "--CircularProgress-trackThickness": "3px",
                      "--CircularProgress-progressThickness": "3px",
                      "--CircularProgress-size": "30px"
                    }}
                  />
                </div>
              </div>
          </div>
          <StorageItemDescription
            name={file ? file.name : 'Unknown'} 
          />
        </div>
      </StorageItemWrapper>
    );
  };
    
  return (
    <StorageItemWrapper>
      <div 
        className={styles.wrapper} 
        data={file.id}
        onMouseEnter={() => setSelectedOpenState(true)}
        onMouseLeave={() => setSelectedOpenState(false)}
      >
        <div className={styles.content}>
          {image ? 
            <img 
              src={image} 
              className={styles.image}
              draggable={false}
              id={aspectRatio < 1 ? 'width' : 'height'}
            />
          : 
            <div className={styles.file}>
              <span>{file.type}</span>
            </div>}
        </div>
        <StorageItemDescription
          name={file ? file.name : 'Unknown'} 
          time={file ? file.creationTime : undefined} 
        />
      </div>
    </StorageItemWrapper>
  );
};

export default File;