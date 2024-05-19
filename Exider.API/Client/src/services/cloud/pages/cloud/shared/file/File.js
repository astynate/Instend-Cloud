import React, { useLayoutEffect, useState } from 'react';
import styles from './main.module.css';
import { ConvertDate } from '../../../../../../utils/DateHandler';
import Loader from '../../../../shared/loader/Loader';

const File = (props) => {
  const [aspectRatio, setAspectRatio] = useState(1);

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

  } else if (props.isLoading === true) {
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
                  <Loader />
                </div>
                <span>{props.type}</span>
              </div>}
          </div>
          <div className={styles.description}>
            <span className={styles.name}>{props.name ? props.name: "Not set"}</span>
            <span className={styles.time}>Loading...</span>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div 
        className={styles.wrapper} 
        onClick={props.callback} 
        onContextMenu={props.onContextMenu}
        data={props.file.id}
      >
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
  }
};

export default File;