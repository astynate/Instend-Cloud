import React, { useContext, useState } from 'react';
import { instance } from '../../../../../state/Interceptors';
import { ConvertDate } from '../../../../../utils/DateHandler';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import Search from '../../../features/search/Search';
import Header from '../../../widgets/header/Header';
import userState from '../../../../../states/user-state';
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
import { useNavigate, useParams } from 'react-router-dom';
import PropertiesWindow from '../widgets/properties/Properties';
import { storageWSContext } from '../../../layout/Layout';

const Cloud = observer((props) => {
  const params = useParams();
  const navigate = useNavigate();

  const { user } = userState;
  const [isFolderProperties, setFolderProperties] = useState(true);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [fileName, setFilename] = useState('');
  const [isRenameOpen, setRenameState] = useState(false);
  const [isContextMenuOpen, setContextMenuState] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState([0, 0]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isPreview, setPreviewState] = useState(false);
  const [isRightPanelOpen, setRightPanelState] = useState(false);
  const [path, setPath] = useState([]);

  storageWSContext.useSignalREffect(
    "CreateFolder",
    (folder) => {
      setFolders(prev => [
        ...prev,
        <Folder 
          key={folder.id} 
          id={folder.id}
          folder={folder}
          name={folder.name} 
          time={ConvertDate(folder.creationTime)}
          onContextMenu={(event) => {
            event.preventDefault();
            setContextMenuState(true);
            setContextMenuPosition([event.clientX, event.clientY]);
            setFilename(folder.name);
            setSelectedItems([folder]);
          }}
        />
      ]);
    },
  );

  storageWSContext.useSignalREffect(
    "RenameFile",
    (file) => {
      setFiles(prev => {
        const updatedFiles = prev.map(prevFile => {
          if (prevFile.key === file.id) {
            return {
              ...prevFile,
              name: file.newName
            };
          }
          return prevFile;
        });
        return updatedFiles;
      });
    },
  );
  
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
    const GetFiles = async () => {
      const response = await instance.get(`/storage?id=${params.id ? params.id : ""}`);

      setFolders(response.data[0] ? response.data[0].map(element => {
        element.type = "folder";

        return (
          <Folder 
            key={element.id} 
            id={element.id}
            folder={element}
            name={element.name} 
            time={ConvertDate(element.creationTime)}
            onContextMenu={(event) => {
              event.preventDefault();
              setContextMenuState(true);
              setContextMenuPosition([event.clientX, event.clientY]);
              setFilename(element.name);
              setSelectedItems([element]);
            }}
          />
        )
      }) : []);

      setFiles(response.data[1] ? response.data[1].map(element => {
        element.type = "file";

        return (
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
              setSelectedItems([element]);
            }}
          />
        )
      }) : []);

      setPath(response.data[2] ? 
        response.data[2] : []);
    };

    setFiles(Array.from({ length: 4 }).map((_, index) => (
      <File key={index} isPlaceholder={true} />)));

    GetFiles();

  }, [params.id]);

  useEffect(() => {

    if (props.setPanelState) {
      props.setPanelState(false);
    }

  }, [props.setPanelState]);

  return (
    <>
      <Search />
      <Header />
      {isPreview ? 
          <Preview
            close={() => setPreviewState(false)} 
            file={selectedItems[0]}
          />
        : null}
      <div className={styles.wrapper}>
        <div className={styles.contentWrapper}>
          <CloudHeader 
            name={user.nickname} 
            path={path} 
          />
          {isRenameOpen === true ?
            <PopUpField 
              title={'Rename'}
              text={'This field is require'}
              field={[fileName, setFilename]}
              close={() => setRenameState(false)}
              callback={() => 
                instance.put(`/${selectedItems[0].type === "file" ? 
                  "storage" : "folders"}?id=${selectedItems[0].id}&name=${fileName}`)
              }
          /> : null}
          {isContextMenuOpen === true ?
            <ContextMenu 
              items={[
                [Open, "Open", () => {
                  if (selectedItems[0].type === "file") {
                    setPreviewState(true);
                  } else {
                    navigate(`/cloud/${selectedItems[0].id}`)
                  }
                }],
                [Rename, "Rename", () => setRenameState(true)],
                [Properties, "Properties", () => { 
                  if (selectedItems[0].type === "file") {
                    setRightPanelState(true);
                  } else {
                    setFolderProperties(true);
                  }
                }],
                [Share, "Share", () => alert('!')],
                [Delete, "Delete", () => {
                    instance.delete(`/${selectedItems[0].type === "file" ? 
                      "storage" : "folders"}?id=${selectedItems[0].id}`)
                  }
                ]
              ]} 
              close={() => 
                setContextMenuState(false)
              }
              position={contextMenuPosition}
          /> : null}
          <div className={styles.content}>
            {folders.map(el => el)}
            {files.map(el => el)}
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
            items={[
              // {
              //   "key": "Key",
              //   "value": "value"
              // },
              // {
              //   "key": "Key",
              //   "value": "value"
              // }
            ]}
          />
        : null}
      </div>
    </>
  )
});

export default Cloud;