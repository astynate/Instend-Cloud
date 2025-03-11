import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import { ConvertFullDate } from '../../../../../../handlers/DateHandler';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import AlbumsController from '../../../../api/AlbumsController';
import AddInAlbum from '../../widgets/add-in-album/AddInAlbum';
import styles from './main.module.css';
import PhotosList from '../../../../features/lists/photos-list/PhotosList';
import GalleryState from '../../../../../../state/entities/GalleryState';
import remove from '../albums/images/remove.png';

const Album = observer(({}) => {
    const [isHasMore, setHasMoreState] = useState(true);
    const { album, setAlbum } = GalleryState;
    const params = useParams();

    useEffect(() => {
        if (!params || !params.id) {
            return;
        };

        if (!isHasMore) {
            return;
        };

        AlbumsController.GetAlbum(
            params.id, 
            album?.files?.length, 
            5, 
            (data) => AlbumsController.GetAlbumDefaultCallback(data, album, setAlbum, params, setHasMoreState)
        );
    }, [params.id, album, isHasMore]);

    useEffect(() => {
        setHasMoreState(true);
    }, [params.id]);

    if (!album) {
        return null;
    };

    return (
        <>
            <AddInAlbum />
            <ContentWrapper>
                <div className={styles.header}>
                    <h1>{album.name}</h1>
                    <span className={styles.date}>{ConvertFullDate(album.creationTime)}</span>
                </div>
                <PhotosList
                    photos={album.files}
                    contextMenuItems={[
                        { title: 'Remove', image: remove, red: true, callback: (file) => AlbumsController.RemoveFileAsync(params.id, file) }
                    ]}
                />
            </ContentWrapper>
        </>
    );
});

export default Album;