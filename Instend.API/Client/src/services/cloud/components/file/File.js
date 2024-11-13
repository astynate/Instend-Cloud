import React, { useLayoutEffect, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';

const File = (props) => {
  const [aspectRatio, setAspectRatio] = useState(1);
  const [isSelected, setSelectedState] = useState(false);
  const [isSelectedOpen, setSelectedOpenState] = useState(false);

  useLayoutEffect(() => {
    var img = new Image();

    img.onload = function() {
      var width = this.naturalWidth;
      var height = this.naturalHeight;

      setAspectRatio(height / width);
    };

    img.src = `data:image/png;base64,${props.image ? props.image : null}`;
  }, [props.image]);

  if (props.isPlaceholder === true) {
    return (
      <div className={styles.wrapper}>
        <div className={styles.content} id="placeholder">

        </div>
      </div>
    );
  }
  
  if (props.isLoading === true) {
    return (
      <>
        <div 
          className={styles.wrapper} 
          onClick={props.callback} 
          onContextMenu={props.onContextMenu}
          data={null}
        >
          <div className={styles.content} id={props.isSelected === true ? 'selected' : null}>
            {props.image != null ? 
              <div className={styles.loaderWrapper}>
                  <div className={styles.loader}>
                    <Loader />
                  </div>
                    <img 
                      src={`data:image/png;base64,${props.image}`} 
                      className={styles.image}
                      draggable={false}
                      id={aspectRatio < 1 ? 'width' : 'height'}
                    />
              </div>
            :
              <div className={styles.file} id="loading">
                <div className={styles.loader}>
                  <CircularProgress 
                    value={props.file && props.file.perscentage !== undefined && props.file.perscentage !== null ? props.file.perscentage : 20}
                    sx={{
                      "--CircularProgress-trackThickness": "3px",
                      "--CircularProgress-progressThickness": "3px",
                      "--CircularProgress-size": "30px"
                    }}
                  />
                </div>
              </div>}
          </div>
          <div className={styles.description}>
            <span className={styles.name}>{props.name ? props.name: "Not set"}</span>
            <span className={styles.time}>Loading...</span>
          </div>
        </div>
      </>
    );
  }
    
  return (
    <div 
      className={styles.wrapper} 
      onClick={props.callback} 
      onContextMenu={props.onContextMenu}
      data={props.file.id}
      onMouseEnter={() => setSelectedOpenState(true)}
      onMouseLeave={() => setSelectedOpenState(false)}
    >
      <SelectUIElements 
        isSelected={isSelected} 
        setSelectedState={setSelectedState}
        isSelectedOpen={isSelectedOpen}
        setSelectedFiles={props.setSelectedFiles ? props.setSelectedFiles : () => {}}
        element={props.file}
      />
      <div className={styles.content} id={props.isSelected === true ? 'selected' : null}>
        {props.image != null ? 
          <img 
            src={`data:image/png;base64,${props.image}`} 
            className={styles.image}
            draggable={false}
            id={aspectRatio < 1 ? 'width' : 'height'}
          />
        : 
          <div className={styles.file}>
            <span>{props.type}</span>
          </div>}
      </div>
      <div className={styles.description}>
        <span className={styles.name}>{props.name}</span>
        <span className={styles.time}>{ConvertDate(props.time)}</span>
      </div>
    </div>
  );
};

export default File;