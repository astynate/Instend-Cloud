import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import AddButton from '../../../../ui-kit/buttons/add-button/Add';
import album from './images/types/album.png';
import image from './images/types/image.png';
import CloudController from '../../../../api/CloudController';
import InstendCloud from '../../../../integrations/instend-cloud/InstendCloud';
import GlobalContext from '../../../../../../global/GlobalContext';
import AlbumsController from '../../../../api/AlbumsController';

const AddInAlbum = ({ }) => {
    const [isInstendCloudOpen, setInstendCloudState] = useState(false);
    const [files, setFiles] = useState([]);
    const params = useParams();

    const setFilteredItems = (items) => {
        setFiles(prev => {
            prev = items(prev);
            prev = prev.filter(f => GlobalContext.supportedImageTypes.includes(f.type))
            
            return prev;
        });
    };

    return (
        <>
            <InstendCloud
                isOpen={isInstendCloudOpen} 
                close={() => setInstendCloudState(false)}
                files={files}
                setSelectedFiles={setFilteredItems}
                button={{title: 'Add', callback: async () => {
                    await AlbumsController.UploadInAlbum(params.id, files);
                    setInstendCloudState(false);
                }}}
            />
            <AddButton
                items={[
                    {image: album, title: "Cloud", callback: () => setInstendCloudState(true)},
                    {image: image, title: "Device", callback: () => {}, type: "upload", sendFiles: (event) => {
                        CloudController.UploadFilesInAlbumAsync(params.id, event.target.files);
                    }}
                ]}
            />
        </>
    );
};

export default AddInAlbum;