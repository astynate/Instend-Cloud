import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storageWSContext } from '../../../layout/Layout';
import { toJS } from 'mobx';
import { RenameCallback } from './Callbacks';
import { AdaptId } from '../../../../../states/storage-state';
import { Delete, Properties } from './ContextMenuHandler';
import storageState from '../../../../../states/storage-state';
import userState from '../../../../../states/user-state';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import styles from './main.module.css';
import CloudHeader from '../widgets/header/Header';
import File from '../shared/file/File';
import ContextMenu from '../../../shared/context-menu/ContextMenu';
import Open from './images/context-menu/open.png';
import Rename from './images/context-menu/rename.png';
import PropertiesImage from './images/context-menu/properties.png';
import Share from './images/context-menu/share.png';
import DeleteImage from './images/context-menu/delete.png';
import PopUpField from '../../../shared/pop-up-filed/PopUpField';
import Preview from '../../../../preview/layout/Preview';
import RightPanel from '../widgets/right-panel/RightPanel';
import Folder from '../shared/folder/Folder';
import PropertiesWindow from '../widgets/properties/Properties';
import Information from '../../../shared/information/Information';
import SelectBox from '../../../shared/interaction/select-box/SelectBox';

const Cloud = observer((props) => {
  const navigate = useNavigate();
  const { user } = userState;
  const { files, folders } = storageState;
  const [isFolderProperties, setFolderProperties] = useState(false);
  const [fileName, setFilename] = useState('');
  const [isRenameOpen, setRenameState] = useState(false);
  const [isContextMenuOpen, setContextMenuState] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPreview, setPreviewState] = useState(false);
  const [isRightPanelOpen, setRightPanelState] = useState(false);
  const [isError, setErrorState] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoadingState] = useState(false);
  const [activeFiles, setActiveFiles] = useState([]);
  const params = useParams();
  const selectPlaceWrapper = useRef();
  const selectPlace = useRef();

  const ErrorMessage = (title, message) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorState(true);
  }

  const single = [
    [Open, "Open", () => OpenPreview(activeFiles[0])],
    [Rename, "Rename", () => setRenameState(true)],
    [PropertiesImage, "Properties", () => Properties(activeFiles[0], setRightPanelState, setFolderProperties)],
    [DeleteImage, "Delete", async () => Delete(activeFiles, ErrorMessage, params.id)]
  ]

  const multiple = [
    [DeleteImage, "Delete", async () => Delete(activeFiles, ErrorMessage, params.id)]
  ]

  const [contextMenuItems, setContextMenuItems] = useState(single);

  const OpenPreview = (file) => {
    setSelectedItems([file]);

    if (file.strategy === "file") {
      setPreviewState(true);
    } else {
      navigate(`/cloud/${activeFiles[0].id}`)
    }
  };
  
  useEffect(() => {
    const Connect = async () => {
        if (storageWSContext.connection.state === "Connected") {
          await storageWSContext.connection.invoke("Join", 
            localStorage.getItem("system_access_token")); 
        }       
    }

    Connect();
  }, [storageWSContext.connection.state]);

  useEffect(() => {
    if (!storageState.files || !storageState.files[params.id]) {
      (async () => {
        setLoadingState(true);
        await storageState.SetFolderItemsById(params.id);
        setLoadingState(false);
      })();
    }

    storageState.SetFolderItemsById(params.id, ErrorMessage);
  }, [params.id]);

  const ClearSelectedItems = (event) => {
    if ([selectPlace, selectPlaceWrapper]
        .includes(event.target) === false &&
        event.shiftKey === false) {
      setSelectedItems([]); 
    }
  }

  useEffect(() => {
    window.addEventListener('click', ClearSelectedItems);

    return () => {
      window.removeEventListener('click', ClearSelectedItems);
    };
  }, []);

  useEffect(() => {
    if (props.setPanelState) { props.setPanelState(false); }
  }, [props.setPanelState]);

  useEffect(() => {
    if (selectedItems.length > 1) {
      setContextMenuItems(multiple);
    } else {
      setContextMenuItems(single);
    }
    
    if (selectedItems.length > 0) {
      setActiveFiles(selectedItems);
    }
  }, [activeFiles, selectedItems]);

  const HandleSelect = (event, element) => {
    if (event.shiftKey) {
      if (selectedItems.map(element => element.id).includes(element.id)) {
        setSelectedItems(prev => prev
          .filter(e => e.id !== element.id)); 
      }
      else {
        setSelectedItems(prev => [...prev, element]);
      }

      event.preventDefault();
    } else {
      setSelectedItems(prev => prev
        .filter(e => e.id !== element.id)); 
    }
  }

  return (
    <div className={styles.cloud}>
      <Search />
      <Header />
      {isPreview && 
          <Preview
            close={() => setPreviewState(false)} 
            file={activeFiles[0]}
            ErrorMessage={ErrorMessage}
          />}
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper} ref={selectPlaceWrapper}>
          <CloudHeader 
            name={user.nickname} 
            path={storageState.path && storageState.path[AdaptId(params.id)] ? 
              storageState.path[AdaptId(params.id)] : null}
            error={ErrorMessage}
          />
          {isRenameOpen === true &&
            <PopUpField 
              title={'Rename'}
              text={'This field is require'}
              field={[fileName, setFilename]}
              open={isRenameOpen}
              close={() => setRenameState(false)}
              callback={async () => {await RenameCallback(fileName, activeFiles[0], ErrorMessage)}}
            />}
          <Information
            open={isError}
            close={() => setErrorState(false)}
            title={errorTitle}
            message={errorMessage}
          />
          {isContextMenuOpen === true &&
            <ContextMenu 
              items={contextMenuItems} 
              close={() => setContextMenuState(false)}
              isContextMenu={true}
              position={contextMenuPosition}
            />}
          <div className={styles.content} ref={selectPlace}>
            {isLoading ? 
                Array.from({ length: 4 }).map((_, index) => (
                  <File key={index} isPlaceholder={true} />))
            : null}
            {folders && toJS(folders)[AdaptId(params.id)] ?
              toJS(folders)[AdaptId(params.id)].map((element, index) => {
                return (
                  <Folder 
                    key={element.id} 
                    id={element.id}
                    isSelected={selectedItems.map(element => element.id).includes(element.id)}
                    folder={element}
                    name={element.name} 
                    time={element.creationTime}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setContextMenuState(true);
                      setContextMenuPosition([event.clientX, event.clientY]);
                      setFilename(element.name);
                      
                      if (selectedItems.map(element => element.id).includes(element.id) === false) {
                        setSelectedItems(prev => [...prev, element])
                      }
                    }}
                    callback={(event) => HandleSelect(event, element)}
                  />
                )
              })
            : null}
            {files && toJS(files)[AdaptId(params.id)] ?
              toJS(files)[AdaptId(params.id)].map(element => {
                return (
                  <File 
                    key={element.id} 
                    name={element.name} 
                    time={element.lastEditTime}
                    image={element.fileAsBytes == "" ? null : element.fileAsBytes}
                    type={element.type}
                    isSelected={selectedItems.map(element => element.id).includes(element.id) === true}
                    onClick={() => OpenPreview(element)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setContextMenuState(true);
                      setContextMenuPosition([event.clientX, event.clientY]);
                      setFilename(element.name);

                      if (selectedItems.map(element => element.id).includes(element.id) === false) {
                        setSelectedItems(prev => [...prev, element])
                      }
                    }}
                    callback={(event) => HandleSelect(event, element)}
                  />
                )
              })
            : null}
          </div>
        </div>
        {isRightPanelOpen === true && 
          <RightPanel 
            file={selectedItems} 
            close={() => setRightPanelState(false)} 
          />}
        {isFolderProperties === true &&
          <PropertiesWindow 
            file={selectedItems[0]}
            close={() => setFolderProperties(false)} 
            items={[]}
          />}
        <SelectBox 
          setSelectedItems
          selectPlace={[selectPlaceWrapper, selectPlace]} 
        />
      </div>
    </div>
  )
});

export default Cloud;