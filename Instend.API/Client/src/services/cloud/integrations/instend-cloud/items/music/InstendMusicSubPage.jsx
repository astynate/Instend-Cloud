import { observer } from 'mobx-react-lite';
import styles from './main.module.css';
import StorageState from '../../../../../../state/entities/StorageState';
import FilesController from '../../../../api/FilesController';
import GlobalContext from '../../../../../../global/GlobalContext';
import ScrollElementWithAction from '../../../../elements/scroll/scroll-element-with-action/ScrollElementWithAction';
import Song from '../../../../components/song/Song';
import SelectElementWithCheckmark from '../../../../elements/select/select-element-with-checkmark/SelectElementWithCheckmark';

const InstendMusicSubPage = observer(({wrapper, files = [], setFiles = () => {}}) => {
    let songs = StorageState.GetSelectionByType(GlobalContext.supportedMusicTypes);

    return (
        <div className={styles.wrapper}>
            {songs.map(song => {
                return (
                    <SelectElementWithCheckmark
                        top={5}
                        right={5}
                        key={song.id} 
                        item={song}
                        items={files}
                        setItems={setFiles}
                        isSelectedOpen={true}
                        maxLength={7}
                    >
                        <Song
                            song={song}
                        />
                    </SelectElementWithCheckmark>
                )
            })}
            <ScrollElementWithAction
                scroll={wrapper}
                isHasMore={StorageState.hasMoreSongs}
                count={StorageState.countSongs}
                callback={() => {
                    FilesController.GetLastFilesWithType(
                        5, 
                        songs.length, 
                        "music",
                        StorageState.OnGetFilesByTypeSuccess
                    );
                }}
            />
        </div>
    );
});

export default InstendMusicSubPage;