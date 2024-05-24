import React, { useEffect, useRef, useState } from 'react';
import album from './images/types/album.png';
import music from './images/types/music.png';
import CreateAlbum from '../../../../widgets/create-album/CreateAlbum';
import Add from '../../../../shared/ui-kit/add/Add';
import { SendFilesFromEvent } from '../../../cloud/api/FileRequests';

const AddInMusic = (props) => {
    const [isCreateAlbumOpen, setCreateAlbumOpen] = useState(false);

    return (
        <>
            {isCreateAlbumOpen && <CreateAlbum 
                open={isCreateAlbumOpen}
                close={() => {setCreateAlbumOpen(false)}}
            />}
            <Add 
                items={[
                    {image: album, title: "Playlist", callback: () => {setCreateAlbumOpen(true)}},
                    {image: music, title: "Song", callback: () => {}, type: "upload", sendFiles: (event) => {
                        if (props.id) {
                            // UploadPhotosInAlbum(event, 'Photos', props.id);
                        } else {
                            SendFilesFromEvent(event, 'Photos');
                        }
                    }}
                ]}
            />
        </>
    );
 };

export default AddInMusic;