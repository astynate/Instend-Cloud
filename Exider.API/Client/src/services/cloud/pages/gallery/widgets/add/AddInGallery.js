import React, { useEffect, useRef, useState } from 'react';
import album from './images/types/album.png';
import image from './images/types/image.png';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';
import Add from '../../../../shared/ui-kit/add/Add';
import { UploadPhotosInAlbum, UploadPhotosInGallery } from '../../api/GalleryRequests';
import { SendFilesFromEvent } from '../../../cloud/api/FileRequests';

const AddInGallery = (props) => {
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);

    return (
        <>
            {isCreateAlbumOpen && <CreateAlbum 
                open={isCreateAlbumOpen}
                close={() => {setCreateAlbumOpen(false)}}
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