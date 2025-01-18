import React, { useLayoutEffect, useState } from 'react';
import { CircularProgress } from '@mui/joy';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import SelectElementWithCheckmark from '../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';

const File = ({image, isLoading, file}) => {
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

    img.src = `data:image/png;base64,${image ? image : null}`;
  }, [image]);

  // if (props.isPlaceholder === true) {
  //   return (
  //     <div className={styles.wrapper}>
  //       <div className={styles.content} id="placeholder">

  //       </div>
  //     </div>
  //   );
  // }
  
  // if (isLoading === true) {
  //   return (
  //     <>
  //       <div 
  //         className={styles.wrapper} 
  //         // onClick={props.callback} 
  //         // onContextMenu={props.onContextMenu}
  //         data={null}
  //       >
  //         <div className={styles.content}>
  //           {image != null ? 
  //             <div className={styles.loaderWrapper}>
  //                 <div className={styles.loader}>
  //                   {/* <Loader /> */}
  //                 </div>
  //                   <img 
  //                     src={`data:image/png;base64,${image}`} 
  //                     className={styles.image}
  //                     draggable={false}
  //                     id={aspectRatio < 1 ? 'width' : 'height'}
  //                   />
  //             </div>
  //           :
  //             <div className={styles.file} id="loading">
  //               <div className={styles.loader}>
  //                 <CircularProgress 
  //                   value={file && file.perscentage !== undefined && file.perscentage !== null ? file.perscentage : 20}
  //                   sx={{
  //                     "--CircularProgress-trackThickness": "3px",
  //                     "--CircularProgress-progressThickness": "3px",
  //                     "--CircularProgress-size": "30px"
  //                   }}
  //                 />
  //               </div>
  //             </div>}
  //         </div>
  //         <div className={styles.description}>
  //           <span className={styles.name}>{file.name ? file.name: "Unknown"}</span>
  //           {/* <span className={styles.time}>Loading...</span> */}
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
    
  return (
    <div 
      className={styles.wrapper} 
      data={file.id}
      onMouseEnter={() => setSelectedOpenState(true)}
      onMouseLeave={() => setSelectedOpenState(false)}
    >
      {/* <SelectElementWithCheckmark 
        isSelected={isSelected} 
        setSelectedState={setSelectedState}
        isSelectedOpen={isSelectedOpen}
        setSelectedFiles={setSelectedFiles ? setSelectedFiles : () => {}}
        element={file}
      /> */}
      <div className={styles.content}>
        {image != null ? 
          <img 
            src={`data:image/png;base64,${image}`} 
            className={styles.image}
            draggable={false}
            id={aspectRatio < 1 ? 'width' : 'height'}
          />
        : 
          <div className={styles.file}>
            <span>{file.type}</span>
          </div>}
      </div>
      <div className={styles.description}>
        <span className={styles.name}>{file.name}</span>
        <span className={styles.time}>{ConvertDate(file.creationTime)}</span>
      </div>
    </div>
  );
};

export default File;