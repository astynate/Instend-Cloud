import GlobalContext from '../../../../../../../../global/GlobalContext';
import { observer } from 'mobx-react-lite';
import { FormatFileSize } from '../../../../../../../../handlers/StorageSpaceHandler';
import MessageAttachmentsWrapper from '../../../../../../features/wrappers/message-attachments-wrapper/MessageAttachmentsWrapper';
import styles from './main.module.css';
import play from './images/play.png';
import pause from './images/pause.png';
import MusicState from '../../../../../../../../state/entities/MusicState';
import SimpleRange from '../../../../../../ui-kit/ranges/simple-range/SimpleRange';

const MessageFilesAttachments = observer(({isCurrentAccountMessage = false, files = []}) => {
    const { isPlaying, GetCurrentSongId, SetSongAsPlaying } = MusicState;
    const { duration, time, setTime, loadPercentage } = MusicState;
    let currentSongId = GetCurrentSongId();
    
    return (
        <MessageAttachmentsWrapper isCurrentAccountMessage={isCurrentAccountMessage}>
            <div className={styles.files}>
                {files.map(file => {
                    const isMusicFile = GlobalContext.supportedMusicTypes
                        .includes(file.type);

                    return (
                        <div key={file.id} className={styles.file}>
                            {isMusicFile ?
                                <div className={styles.play} onClick={() => SetSongAsPlaying(file)}>
                                    <img src={currentSongId === file.id && isPlaying ? pause : play} draggable="false" />
                                </div>
                            :
                                <div className={styles.icon}>
                                    <span>{file.type}</span>
                                </div>}
                            <div className={styles.information}>
                                <span>{file.name}</span>
                                {currentSongId === file.id && isPlaying ? <div className={styles.range}>
                                    <SimpleRange
                                        step={1}
                                        minValue={0}
                                        maxValue={duration ? duration : 100}
                                        value={time} 
                                        setValue={setTime} 
                                        loadPercentage={loadPercentage} 
                                        isActive={true}
                                    />
                                </div>
                            :
                                <span>{FormatFileSize(file.size)}</span>} 
                            </div>
                        </div>
                    )
                })}
            </div>
        </MessageAttachmentsWrapper>
    );
});

export default MessageFilesAttachments;