import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AddButton from '../../../../../ui-kit/buttons/add-button/Add';
import CreateAlbum from '../../../../../features/pop-up-windows/create-album-popup/CreateAlbum';
import AlbumsController from '../../../../../api/AlbumsController';
import album from './images/types/album.png';
import image from './images/types/music.png';
import CloudController from '../../../../../api/CloudController';

const AddInSongs = ({ id }) => {
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);
    const params = useParams();

    return (
        <>
            <CreateAlbum
                title='Create a playlist'
                isOpen={isCreateAlbumOpen}
                closeCallback={() => setCreateAlbumOpen(false)}
                id={id}
                callback={(name, description, image) => {
                    AlbumsController.CreateAlbum(name, description, image, '/api/playlists/create');
                }}
            />
            <AddButton
                items={[
                    {image: album, title: "Playlist", callback: () => setCreateAlbumOpen(true)},
                    {image: image, title: "Song", callback: () => {}, type: "upload", sendFiles: (event) => {
                        if (params.id) {
                            CloudController.UploadFilesInAlbumAsync(params.id, event.target.files);
                        } else {
                            CloudController.UploadFilesFromEvent(event, 'Music');
                        };
                    }}
                ]}
            />
        </>
    );
 };

export default AddInSongs;