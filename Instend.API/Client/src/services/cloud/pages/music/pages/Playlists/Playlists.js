import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import styles from './main.module.css';
import GalleryState from '../../../../../../state/entities/GalleryState';
import AlbumsController from '../../../../api/AlbumsController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import ContextMenu from '../../../../shared/context-menus/context-menu/ContextMenu';
import remove from './images/remove.png';
import PlayListPreview from '../../../../components/playlist/PlayListPreview';
import AddInSongs from '../songs/add-in-songs-button/AddInSongs';

const Playlists = observer(() => {
    const wrapper = useRef();
    const { isHasMorePlaylists, playlists } = GalleryState;

    useEffect(() => {
        if (isHasMorePlaylists) {
            AlbumsController.GetPlaylists(playlists.length, 5);
        };
    }, [isHasMorePlaylists, playlists.length]);

    return (
        <>        
            <AddInSongs />
            <ContentWrapper>
                <div className={styles.content} ref={wrapper}>
                    {playlists.map(value => {
                            return (
                                <ContextMenu
                                    key={value.id} 
                                    items={[
                                        { 
                                            title: "Delete", 
                                            image: remove, 
                                            red: true, 
                                            callback: () => {
                                                AlbumsController.DeleteAlbums([value]);
                                            }
                                        }
                                    ]}
                                >
                                    <PlayListPreview playlist={value} />
                                </ContextMenu>
                            )
                        })
                    }
                </div>
            </ContentWrapper>
        </>
    );
});

export default Playlists;