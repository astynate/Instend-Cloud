import React, { useEffect, useLayoutEffect, useState } from 'react';
import styles from './main.module.css';
import { ConvertDate } from '../../../../../../utils/DateHandler';

const File = (props) => {
  const [aspectRatio, setAspectRatio] = useState(1);

  useLayoutEffect(() => {
    var img = new Image();

    img.onload = function() {
      var width = this.naturalWidth;
      var height = this.naturalHeight;

      setAspectRatio(height / width);
    };

    img.src = `data:image/png;base64,${props.image}`;

  }, [props.image]);

  if (props.isPlaceholder === true) {

    return (
      <div className={styles.wrapper}>
        <div className={styles.content} id="placeholder">

        </div>
      </div>
    );

  } else {

    return (
      <div className={styles.wrapper} onClick={props.onClick} onContextMenu={props.onContextMenu}>
        <div className={styles.content}>
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