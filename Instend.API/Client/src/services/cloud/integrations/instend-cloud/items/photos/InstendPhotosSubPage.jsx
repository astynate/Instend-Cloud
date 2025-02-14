import { useRef } from 'react';
import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import ScrollElementWithAction from '../../../../elements/scroll/scroll-element-with-action/ScrollElementWithAction';
import StorageState from '../../../../../../state/entities/StorageState';
import GlobalContext from '../../../../../../global/GlobalContext';
import StorageController from '../../../../../../api/StorageController';
import FilesController from '../../../../api/FilesController';
import SelectElementWithCheckmark from '../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';

const InstendPhotosSubPage = observer(({files = [], setFiles = () => {}, wrapper}) => {
    let photosWrapper = useRef();
    let photos = StorageState.GetSelectionByType(GlobalContext.supportedImageTypes);

    return (
        <div className={styles.wrapper} ref={photosWrapper}>
            {photos.map(photo => {
                if (GlobalContext.supportedVideoTypes.includes(photo.type.toLowerCase())) {
                    return (
                        <div key={photo.id} className={styles.photo}>
                            <video>

                            </video>
                        </div>
                    );
                };

                return (
                    <SelectElementWithCheckmark 
                        top={5}
                        right={5}
                        key={photo.id} 
                        item={photo}
                        items={files}
                        setItems={setFiles}
                        isSelectedOpen={true}
                        maxLength={7}
                    >
                        <div className={styles.photo}>
                            <img 
                                src={StorageController.getFullFileURL(photo.path)}
                                draggable="false" 
                            />
                        </div>
                    </SelectElementWithCheckmark>
                )
            })}
            <ScrollElementWithAction
                isHasMore={false}
                callback={() => {
                    FilesController.GetLastFilesWithType(
                        5, 
                        photos.length, 
                        "gallery",
                        StorageState.OnGetFilesByTypeSuccess
                    );
                }}
            />
        </div>
    );
});

export default InstendPhotosSubPage;