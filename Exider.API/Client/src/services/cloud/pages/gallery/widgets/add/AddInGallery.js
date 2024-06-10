import React, { useState } from 'react';
import album from './images/types/album.png';
import image from './images/types/image.png';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';
import Add from '../../../../shared/ui-kit/add/Add';
import { UploadPhotosInAlbum } from '../../api/GalleryRequests';
import { SendFilesFromEvent } from '../../../cloud/api/FileRequests';
import { CreateAlbumRequest } from '../../api/AlbumRequests';

const AddInGallery = (props) => {
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);

    return (
        <>
            {isCreateAlbumOpen && <CreateAlbum 
                title='Create album'
                isOpen={isCreateAlbumOpen}
                closeCallback={() => {setCreateAlbumOpen(false)}}
                id={props.id}
                callback={(name, description, image) => {
                    CreateAlbumRequest('/api/albums/create', name, description, image);
                    setCreateAlbumOpen(false);
                }}
            />}
            <Add 
                items={[
                    {image: album, title: "Album", callback: () => {setCreateAlbumOpen(true)}},
                    {image: image, title: "Image", callback: () => {}, type: "upload", sendFiles: (event) => {
                        if (props.id) {
                            UploadPhotosInAlbum(event, 'Photos', props.id);
                        } else {
                            SendFilesFromEvent(event, 'Photos');
                        }
                    }}
                ]}
            />
        </>
    );
 };

export default AddInGallery;