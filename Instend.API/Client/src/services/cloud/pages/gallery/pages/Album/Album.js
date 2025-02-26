import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../../../features/wrappers/content-wrapper/ContentWrapper';
import AlbumsController from '../../../../api/AlbumsController';

const Album = observer(({}) => {
    const [isHasMore, setHasMoreState] = useState();
    const [album, setAlbum] = useState(undefined);
    let params = useParams();

    useEffect(() => {
        if (!params || !params.id) {
            return;
        };

        AlbumsController.GetAlbum(params.id, album?.files?.length, 5, (data) => {
            if (!data || !data.files) {
                setAlbum(undefined);
                return false;
            };

            if (album && album.files.length && album.id === params.id) {
                setHasMoreState(data.files.length >= 5);
                
                setAlbum(prev => {
                    prev.files = [...prev.files, ...data.files];
                    return prev;
                });

                return;
            };

            setHasMoreState(false);
        });
    }, [params.id, album]);

    if (!album) {
        return null;
    };

    return (
        <>
            <ContentWrapper>
                <h1>{}</h1>
                <span>{}</span>
            </ContentWrapper>
        </>
    );
});

export default Album;