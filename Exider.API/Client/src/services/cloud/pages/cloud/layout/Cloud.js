import React, { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toJS } from 'mobx';
import { RenameCallback } from './Callbacks';
import { AdaptId } from '../../../../../states/storage-state';
import { Properties } from './ContextMenuHandler';
import { autorun } from 'mobx';
import storageState from '../../../../../states/storage-state';
import userState from '../../../../../states/user-state';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import styles from './main.module.css';
import CloudHeader, { sendFiles, sendFilesAsync } from '../widgets/header/Header';
import File from '../shared/file/File';
import Open from './images/context-menu/open.png';
import Rename from './images/context-menu/rename.png';
import PropertiesImage from './images/context-menu/properties.png';
import DeleteImage from './images/context-menu/delete.png';
import PopUpField from '../../../shared/pop-up-filed/PopUpField';
import Preview from '../../../../preview/layout/Preview';
import RightPanel from '../widgets/right-panel/RightPanel';
import Folder from '../shared/folder/Folder';
import PropertiesWindow from '../widgets/properties/Properties';
import Information from '../../../shared/information/Information';
import SelectBox from '../../../shared/interaction/select-box/SelectBox';
import DragFiles from '../../../features/drag-files/DragFiles';
import Placeholder from '../../../shared/placeholder/Placeholder';
import { SendFilesFromDragEvent } from '../api/FileRequests';
import { Delete, RenameFolder } from '../api/FolderRequests';

const Cloud = observer((props) => {
  const navigate = useNavigate();
  const { user } = userState;
  const { files, folders } = storageState;
  const [isFolderProperties, setFolderProperties] = useState(false);
  const [fileName, setFilename] = useState('');
  const [isRenameOpen, setRenameState] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [activeItems, setActiveItems] = useState([]);
  const [isPreview, setPreviewState] = useState(false);
  const [isRightPanelOpen, setRightPanelState] = useState(false);
  const [isError, setErrorState] = useState(false);
  const [errorTitle, setErrorTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoadingState] = useState(false);
  const [items, setItems] = useState([...Object.values(toJS(storageState.files)).flat(), ...Object.values(toJS(storageState.folders)).flat()]);
  const params = useParams();
  const selectPlaceWrapper = useRef();
  const selectPlace = useRef();

  const ErrorMessage = (title, message) => {
    setErrorTitle(title);
    setErrorMessage(message);
    setErrorState(true);
  }

  const single = [
    [Open, "Open", () => OpenPreview(activeItems[0])],
    [Rename, "Rename", () => setRenameState(true)],
    [PropertiesImage, "Properties", () => Properties(activeItems[0], setRightPanelState, setFolderProperties)],
    [DeleteImage, "Delete", async () => Delete(activeItems)]
  ]

  const multiple = [
    [DeleteImage, "Delete", async () => Delete(activeItems)]
  ]

  const OpenPreview = (file) => {
    setSelectedItems([file]);

    if (file.strategy === "file") {
      setPreviewState(true);
    } else {
      navigate(`/cloud/${activeItems[0].id}`);
    }
  };

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

  useEffect(() => {
    const disposer = autorun(() => {
      setItems([...Object.values(toJS(storageState.files)).flat(), ...Object.values(toJS(storageState.folders)).flat()]);
    });

    return () => disposer();
  }, []);

  return (
    <div className={styles.cloud}>
      <Search />
      <Header />
      {isPreview && 
        <Preview
          close={() => setPreviewState(false)} 
          file={activeItems[0]}
          ErrorMessage={ErrorMessage}
        />}
      <DragFiles 
        items={[
          {title: "Current collection", description: "", callback: (event) => {
            SendFilesFromDragEvent(event, params.id);
          }},
          {title: "Main collection", description: "", callback: (event) => {
            SendFilesFromDragEvent(event);
          }},
        ]}
      />
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper} ref={selectPlaceWrapper}>
          <CloudHeader
            name={user.nickname} 
            path={storageState.path && storageState.path[AdaptId(params.id)] ? 
              storageState.path[AdaptId(params.id)] : null}
          />
          {isRenameOpen === true &&
            <PopUpField
              title={'Rename'}
              text={'This field is require'}
              field={[fileName, setFilename]}
              open={isRenameOpen}
              close={() => setRenameState(false)}
              callback={async () => {await RenameFolder(fileName, activeItems[0])}}
            />}
          <Information
            open={isError}
            close={() => setErrorState(false)}
            title={errorTitle}
            message={errorMessage}
          />
          <div className={styles.content} ref={selectPlace}>
            {isLoading ? 
              Array.from({ length: 4 }).map((_, index) => (
                <File key={index} isPlaceholder={true} />
              ))
            : 
              (items.filter(element => element.typeId !== '0' && element.folderId === AdaptId(params.id)).length > 0) ?
                <>
                  {folders && toJS(folders)[AdaptId(params.id)] &&
                    toJS(folders)[AdaptId(params.id)].filter(element => element.typeId !== '0').map((element, index) => (
                      <Folder 
                        key={element.id != null ? element.id : index}
                        id={element.id}
                        isSelected={selectedItems.map(element => element.id).includes(element.id)}
                        folder={element}
                        name={element.name} 
                        time={element.creationTime}
                        onContextMenu={() => setFilename(element.name)}
                        isLoading={element.isLoading}
                      />
                    ))
                  }
                  {files && toJS(files)[AdaptId(params.id)] &&
                    toJS(files)[AdaptId(params.id)].map((element, index) => (
                      <File
                        key={element.id ? element.id : index} 
                        name={element.name}
                        file={element}
                        time={element.lastEditTime}
                        image={element.fileAsBytes == "" ? null : element.fileAsBytes}
                        type={element.type}
                        isLoading={element.isLoading}
                        isSelected={selectedItems.map(element => element.id).includes(element.id)}
                        onClick={() => OpenPreview(element)}
                        onContextMenu={() => setFilename(element.name)}
                      />
                    ))
                  }
                </>
              : 
                <div className={styles.placeholder}>
                  <Placeholder title="No collections uploaded." />
                </div>
            }
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
          selectPlace={[selectPlaceWrapper, selectPlace]}
          selectedItems={[selectedItems, setSelectedItems]}
          activeItems={[activeItems, setActiveItems]}
          itemsWrapper={selectPlace}
          items={items}
          single={single}
          multiple={multiple}
        />
      </div>
    </div>
  )
});

export default Cloud;