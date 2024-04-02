import React, { useState } from 'react';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import userState from '../../../../../states/user-state';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import styles from './main.module.css';
import CloudHeader from '../widgets/header/Header';
import File from '../shared/file/File';
import { instance } from '../../../../../state/Interceptors';
import { ConvertDate } from '../../../../../utils/DateHandler';
import ContextMenu from '../../../shared/context-menu/ContextMenu';
import Open from './images/open.png';
import Rename from './images/rename.png';
import Properties from './images/properties.png';
import Share from './images/share.png';
import Delete from './images/delete.png';
import { OpenCallback, PropertiesCallback } from './FileFunctions';
import { ShareCallback, DeleteCallback } from './FileFunctions';
import PopUpField from '../../../shared/pop-up-filed/PopUpField';
import Preview from '../../../../preview/layout/Preview';

const Cloud = observer((props) => {

  const { user } = userState;

  const [files, setFiles] = useState(Array.from({ length: 10 }).map((_, index) => (
    <File key={index} isPlaceholder={true} />)));

  const [fileName, setFilename] = useState('');
  const [isRenameOpen, setRenameState] = useState(false);
  const [isContextMenuOpen, setContextMenuState] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isPreview, setPreviewState] = useState(false);

  useEffect(() => {

    const GetFiles = async () => {
      const response = await instance.get("/storage");

      if (response.data[1] && response.data[1].length > 0) {
        setFiles(response.data[1].map(element => 
          <File 
            key={element.id} 
            name={element.name} 
            time={ConvertDate(element.lastEditTime)}
            image={element.fileAsBytes == "" ? null : element.fileAsBytes}
            type={element.type}
            onContextMenu={(event) => {
              event.preventDefault();
              setContextMenuState(true);
              setContextMenuPosition([event.clientX, event.clientY]);
              setFilename(element.name);
              setSelectedFiles([element]);
            }}
          />
        ));
      }

      if (response.data[1].length <= 0 && response.data[0].length <= 0){
        setFiles([]);
      }

    };

    GetFiles();

  }, []);

  useEffect(() => {

    if (props.setPanelState) {
        props.setPanelState(false);
    }

  }, [props.setPanelState]);

  return (
    <div className={styles.wrapper}>
      <Search />
      <Header />
      {isPreview ? 
        <Preview 
          close={() => setPreviewState(false)} 
          file={selectedFiles[0]}
        />
      : null}
      <div className={styles.contentWrapper}>
        {isRenameOpen === true ?
          <PopUpField 
            title={'Rename'}
            text={'This field is require'}
            field={[fileName, setFilename]}
            close={() => setRenameState(false)}
            callback={() => 
              instance.put(`/storage?id=${selectedFiles[0].id}&name=${fileName}`)
            }
        /> : null}
        {isContextMenuOpen === true ?
          <ContextMenu 
            items={[
              [Open, "Open", () => setPreviewState(true)],
              [Rename, "Rename", () => setRenameState(true)],
              [Properties, "Properties", PropertiesCallback()],
              [Share, "Share", ShareCallback()],
              [Delete, "Delete", DeleteCallback()]
            ]} 
            close={() => 
              setContextMenuState(false)
            }
            position={contextMenuPosition}
        /> : null}
        <CloudHeader name={user.nickname}/>
        <div className={styles.content}>
          {files.map(el => el)}
        </div>
      </div>
    </div>
  )
});

export default Cloud;