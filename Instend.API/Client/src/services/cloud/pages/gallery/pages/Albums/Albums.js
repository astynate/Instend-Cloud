import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';
import styles from './main.module.css';
import GalleryState from '../../../../../../state/entities/GalleryState';
import Album from '../../../../components/album/Album';
import AlbumsController from '../../../../api/AlbumsController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import ContextMenu from '../../../../shared/context-menus/context-menu/ContextMenu';
import remove from './images/remove.png';

const Albums = observer(() => {
    const wrapper = useRef();
    const { isHasMoreAlbums, albums } = GalleryState;

    useEffect(() => {
        if (isHasMoreAlbums) {
            AlbumsController.GetAlbums(albums.length, 5);
        };
    }, [isHasMoreAlbums, albums.length]);

    return (
        <>        
            <AddInGallery />
            <ContentWrapper>
                <div className={styles.content} ref={wrapper}>
                    {GalleryState.albums.map(value => {
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
                                    <Album album={value} />
                                </ContextMenu>
                            )
                        })
                    }
                </div>
            </ContentWrapper>
        </>
    );
});

export default Albums;