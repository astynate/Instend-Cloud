import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { storageWSContext } from '../../../layout/Layout';
import { toJS } from 'mobx';
import { RenameCallback } from './Callbacks';
import { AdaptId } from '../../../../../states/storage-state';
import storageState from '../../../../../states/storage-state';
import userState from '../../../../../states/user-state';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import styles from './main.module.css';
import CloudHeader from '../widgets/header/Header';
import File from '../shared/file/File';
import ContextMenu from '../../../shared/context-menu/ContextMenu';
import Open from './images/open.png';
import Rename from './images/rename.png';
import Properties from './images/properties.png';
import Share from './images/share.png';
import Delete from './images/delete.png';
import PopUpField from '../../../shared/pop-up-filed/PopUpField';
import Preview from '../../../../preview/layout/Preview';
import RightPanel from '../widgets/right-panel/RightPanel';
import Folder from '../shared/folder/Folder';
import PropertiesWindow from '../widgets/properties/Properties';
import Information from '../../../shared/information/Information';

const Cloud = observer((props) => {
  const navigate = useNavigate();
  const params = useParams();
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

  const ErrorMessage = (title, message) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorState(true);
  }

  const OpenPreview = (file) => {
    setSelectedItems([file]);

    if (file.strategy === "file") {
      setPreviewState(true);
    } else {
      navigate(`/cloud/${selectedItems[0].id}`)
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

  useEffect(() => {
    if (props.setPanelState) { props.setPanelState(false); }
  }, [props.setPanelState]);

  return (
    <>
      <Search />
      <Header />
      {isPreview ? 
          <Preview
            close={() => setPreviewState(false)} 
            file={selectedItems[0]}
            ErrorMessage={ErrorMessage}
          />
        : null}
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <CloudHeader 
            name={user.nickname} 
            path={storageState.path && storageState.path[AdaptId(params.id)] ? 
              storageState.path[AdaptId(params.id)] : null}
            error={ErrorMessage}
          />
          {isRenameOpen === true ?
            <PopUpField 
              title={'Rename'}
              text={'This field is require'}
              field={[fileName, setFilename]}
              close={() => setRenameState(false)}
              callback={async () => {await RenameCallback(fileName, selectedItems, ErrorMessage)}}
            /> : null}
          <Information
            open={isError}
            close={() => setErrorState(false)}
            title={errorTitle}
            message={errorMessage}
          />
          {isContextMenuOpen === true ?
            <ContextMenu 
              items={[
                [Open, "Open", () => OpenPreview(selectedItems[0])],
                [Rename, "Rename", () => setRenameState(true)],
                [Properties, "Properties", () => {}],
                [Share, "Share", () => {}],
                [Delete, "Delete", async () => {}]
              ]} 
              close={() => setContextMenuState(false)}
              isContextMenu={true}
              position={contextMenuPosition}
          /> : null}
          <div className={styles.content}>
            {isLoading ? 
                Array.from({ length: 4 }).map((_, index) => (
                  <File key={index} isPlaceholder={true} />))
            : null}
            {folders && toJS(folders)[AdaptId(params.id)] ?
              toJS(folders)[AdaptId(params.id)].map(element => {
                return (
                  <Folder 
                    key={element.id} 
                    id={element.id}
                    folder={element}
                    name={element.name} 
                    time={element.creationTime}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setContextMenuState(true);
                      setContextMenuPosition([event.clientX, event.clientY]);
                      setFilename(element.name);
                      setSelectedItems([element]);
                    }}
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
                    onClick={() => OpenPreview(element)}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setContextMenuState(true);
                      setContextMenuPosition([event.clientX, event.clientY]);
                      setFilename(element.name);
                      setSelectedItems([element]);
                    }}
                  />
                )
              })
            : null}
          </div>
        </div>
        {isRightPanelOpen === true ? 
          <RightPanel 
            file={selectedItems[0]} 
            close={() => setRightPanelState(false)} 
          /> 
        : null}
        {isFolderProperties === true ? 
          <PropertiesWindow 
            file={selectedItems[0]}
            close={() => setFolderProperties(false)} 
            items={[]}
          />
        : null}
      </div>
    </>
  )
});

export default Cloud;