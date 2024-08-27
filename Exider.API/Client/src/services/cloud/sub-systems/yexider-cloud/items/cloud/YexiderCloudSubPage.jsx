import storageState, { AdaptId } from '../../../../../../states/storage-state';
import File from '../../../../pages/cloud/shared/file/File';
import Folder from '../../../../pages/cloud/shared/folder/Folder';
import styles from './main.module.css';

const YexiderCloudSubPage = () => {
    const { folders, files } = storageState;

    return (
        <div className={styles.wrapper}>
            {folders[AdaptId(null)]
                  .filter(element => element.typeId !== 'System')
                  .map((element, index) => (
                    <Folder 
                      key={element.id != null ? element.id : index}
                      id={element.id}
                      isSelected={false}
                      folder={element}
                      name={element.name} 
                      time={element.creationTime}
                      isLoading={element.isLoading}
                    />
                ))
              }
              {files[AdaptId(null)]
                .map((element, index) => (
                    <File
                        key={element.id ? element.id : index} 
                        name={element.name}
                        file={element}
                        time={element.lastEditTime}
                        image={element.preview == "" ? null : element.preview}
                        type={element.type}
                        isLoading={element.isLoading}
                        isSelected={false}
                    />
                ))
            }
        </div>
    );
}

export default YexiderCloudSubPage;