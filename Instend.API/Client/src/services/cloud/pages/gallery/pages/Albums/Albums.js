import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import AddInGallery from '../../widgets/add-in-gallery-button/AddInGallery';
import styles from './main.module.css';
import GalleryState from '../../../../../../state/entities/GalleryState';
import Album from '../../../../components/album/Album';
import AlbumsController from '../../../../api/AlbumsController';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';

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
                                <Album
                                    key={value.id} 
                                    album={value}
                                />
                            )
                        })
                    }
                </div>
            </ContentWrapper>
        </>
    );
});

export default Albums;