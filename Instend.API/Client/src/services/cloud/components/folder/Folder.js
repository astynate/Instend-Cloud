import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ConvertDate } from '../../../../utils/handlers/DateHandler';
import styles from './main.module.css';
import system from './images/gear.png';

const Folder = (props) => {
  // const [files, setFiles] = useState([]);
  // const [isSelected, setSelectedState] = useState(false);
  // const [isSelectedOpen, setSelectOpenState] = useState(false);

  // useEffect(() => {
  //   if (props.folder && !props.folder.isLoading) {
  //     setFiles(Array.from({ length: 4 }).map((_, index) => {return (
  //       <div className={styles.file} key={index}>
  //         {props.folder.preview && props.folder.preview[index] ?
  //           <div className={styles.filePreview}>
  //             {props.folder.preview[index].fileAsBytes ? 
  //               <img src={`data:image/png;base64,${props.folder.preview[index].fileAsBytes}`} />
  //             : <span>{props.folder.preview[index].type}</span>}
  //           </div>
  //         : null}
  //       </div>
  //     )}));
  //   }
  // }, [props.folder])

  // if (props.isLoading === true) {
  //   return (
  //       <div 
  //         className={styles.wrapper} 
  //         id={props.isSelected === true ? 'selected' : null} 
  //         onContextMenu={props.onContextMenu}
  //       >
  //       <div className={styles.content} id='loading'>
  //         {Array.from({ length: 4 }).map((_, index) => {
  //             return (
  //               <div className={styles.file} key={index}></div>
  //           )})
  //         }
  //       </div>
  //       <div className={styles.description}>
  //         <div className={styles.nameWrapper}>
  //           <span className={styles.name}>{props.name ? props.name : "Not set"}</span>
  //         </div>
  //         <span className={styles.time}>Loading...</span>
  //       </div>
  //     </div> 
  //   )
  // } else {
  //   return (
  //     <Link 
  //       to={`/cloud/${props.id}`} 
  //       data={props.folder.id} 
  //       onClick={props.isPreventDefault ? (event) => {
  //         event.preventDefault();
  //         event.stopPropagation();
  //       } : () => {}}
  //     >
  //       <div 
  //         className={styles.wrapper} 
  //         id={props.isSelected === true ? 'selected' : null} 
  //         onContextMenu={props.onContextMenu}
  //         onMouseEnter={() => setSelectOpenState(true)}
  //         onMouseLeave={() => setSelectOpenState(false)}
  //       >
  //         <SelectElementWithCheckmark 
  //           isSelected={isSelected}
  //           setSelectedState={setSelectedState}
  //           isSelectedOpen={isSelectedOpen}
  //           setSelectedFiles={props.setSelectedFolders}
  //           element={props.folder ?? {id: undefined}}
  //         />
  //         <div className={styles.content} onClick={props.callback}>
  //           {(files)}
  //         </div>
  //         <div className={styles.description}>
  //           <div className={styles.nameWrapper}>
  //             {props.folder.typeId === 'System' && <img src={system} className={styles.folderType} />}
  //             <span className={styles.name}>{props.name}</span>
  //           </div>
  //           <span className={styles.time}>{ConvertDate(props.time)}</span>
  //         </div>
  //       </div>
  //     </Link>
    // );
  // }
};

export default Folder;