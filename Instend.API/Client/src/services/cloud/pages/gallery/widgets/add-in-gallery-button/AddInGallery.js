import React, { useState } from 'react';
import CreateAlbum from '../../../../features/pop-up-windows/create-album-popup/CreateAlbum';
import AddButton from '../../../../ui-kit/buttons/add-button/Add';
import album from './images/types/album.png';
import image from './images/types/image.png';
import AlbumsController from '../../../../api/AlbumsController';

const AddInGallery = ({ id }) => {
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);

    return (
        <>
            <CreateAlbum
                title='Create an album'
                isOpen={isCreateAlbumOpen}
                closeCallback={() => setCreateAlbumOpen(false)}
                id={id}
                callback={(name, description, image) => {
                    AlbumsController.CreateAlbum(name, description, image);
                }}
            />
            <AddButton
                items={[
                    {image: album, title: "Album", callback: () => setCreateAlbumOpen(true)},
                    {image: image, title: "Image", callback: () => {}, type: "upload", sendFiles: (event) => {

                    }}
                ]}
            />
        </>
    );
 };

export default AddInGallery;