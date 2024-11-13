import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import styles from './styles/main.module.css';
// import OpenAccess from './images/open-access.png';
// import Download from './images/download.png';
// import Sort from './images/sort.png';
// import Next from './images/arrow.png';
// import OpenAccessProcess from "../../../../process/open-access/OpenAccessProcess";
// import CollectionsController from "../../../../api/CollectionsController";
// import UnitedSubHeaderButton from "../../../../ui-kit/buttons/united-sub-header-button/UnitedSubHeaderButton";
// import PopUpField from "../../../../shared/popup-windows/pop-up-filed/PopUpField";
// import ContextMenu from "../../../../shared/context-menus/context-menu/ContextMenu";

const CloudHeader = observer((props) => {
    // const params = useParams();
    // const [isSortMenuOpen, setSortMenuState] = useState(false);
    // const [sortMenuPosition, setSortMenuPosition] = useState([0, 60]);
    // const [isOpenAccessWindow, setOpenAccessWindowState] = useState(false);
    // const [type, setType] = useState(types.folder);
    // const [isOpen, setOpenState] = useState(false);
    // const [name, setName] = useState('');

    // const OpenDialog = (current_type) => {
    //     setType(current_type);
    //     setOpenState(true);
    //     setName('');
    // }

    // return (
    //     <>
    //         <div className={styles.header}>
    //             {isOpenAccessWindow === true && 
    //                 <OpenAccessProcess
    //                     id={params.id}
    //                     open={isOpenAccessWindow}
    //                     close={() => setOpenAccessWindowState(false)}
    //                     endPoint={'folders-access'}
    //                     accessSaveCallback={() => {}}
    //                 />}
    //             <div className={styles.buttons}>
    //                 <div className={styles.buttonBlock}>
    //                     {/* <Button 
    //                         img={OpenAccess} 
    //                         title="Open access" 
    //                         onClick={() => {
    //                             if (params.id) {
    //                                 setOpenAccessWindowState(true)
    //                             } else {
    //                                 Error('🔒 Attention!', 'Due to possible security issues, you cannot share this directory.');
    //                             }
    //                         }}
    //                     /> */}
    //                 </div>
    //                 <div className={styles.buttonBlock}>
    //                     <Menu
    //                         items={[
    //                             {
    //                                 'name': 'All', 
    //                                 'route': `/cloud${params['id'] ? '/' + params['id'] : ''}`
    //                             }, 
    //                             {
    //                                 'name': 'Collections', 
    //                                 'route': `/cloud/collections${params['id'] ? '/' + params['id'] : ''}`
    //                             },
    //                             {
    //                                 'name': 'Files', 
    //                                 'route': `/cloud/files${params['id'] ? '/' + params['id'] : ''}`
    //                             }
    //                         ]}
    //                     />
    //                 </div>
    //                 <div className={styles.buttonBlock}>
    //                     <UnitedSubHeaderButton 
    //                         img={Download}
    //                         title="Download" 
    //                         onClick={() => CollectionsController.DownloadCollection(params.id || '')}
    //                     />
    //                     {props.isMobile === false &&<Button 
    //                         img={Sort} 
    //                         title="Name" 
    //                         onClick={(event) => {
    //                             setSortMenuState(prev => !prev);
    //                             setSortMenuPosition([event.clientX, 90]);
    //                         }}
    //                     />}
    //                 </div>
    //             </div>
    //             <div>
    //             {isSortMenuOpen === true &&
    //                 <ContextMenu
    //                     items={[
    //                         [null, "Ascending by name", () => {props.setSortingType(0); setSortMenuState(false);} ],
    //                         [null, "Descending by name", () => {props.setSortingType(1); setSortMenuState(false);}],
    //                         [null, "New ones first", () => {props.setSortingType(2); setSortMenuState(false);}],
    //                         [null, "Old ones first", () => {props.setSortingType(3); setSortMenuState(false);}]
    //                     ]}
    //                     position={sortMenuPosition}
    //                     close={() => setSortMenuState(false)}
    //                     isContextMenu={false}
    //                 />}
    //                 {(props.path && props.path.length > 0) ?
    //                         <h1 className={styles.title}>{props.path[props.path.length - 1].name}</h1>
    //                     :
    //                         <h1 className={styles.title}>Welcome back, {props.name}!</h1>  
    //                 }
    //                 <div className={styles.pathWrapper}>
    //                     <Link to={`/cloud`} className={styles.folder}>
    //                         <span className={styles.path}>Instend Cloud</span>
    //                     </Link>
    //                     {props.path && props.path.map ? props.path.map((element, index) => (
    //                         <Link to={`/cloud/${element.id}`} className={styles.folder} key={index}>
    //                             <img src={Next} />
    //                             <span className={styles.path}>{element.name}</span>
    //                         </Link>
    //                     )) : null}
    //                 </div>
    //             </div>
    //             <PopUpField
    //                 title={type.title}
    //                 text={type.text}
    //                 field={[name, setName]}
    //                 placeholder={type.placeholder}
    //                 close={() => setOpenState(false)}
    //                 open={isOpen}
    //                 callback={async () => {
    //                     if (name === null || name === '') 
    //                         return;

    //                     if (type.type === 'folder') {
    //                         CreateFolder(name, params.id);
    //                     } else {
    //                         CreateFile(name, type.type, params.id);
    //                     }
    //                 }}
    //             />
    //         </div>
    //     </>
    // )
  });
  
  export default CloudHeader;