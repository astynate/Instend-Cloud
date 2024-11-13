import { instance } from "../../../state/application/Interceptors";

class GalleryController {
    static UploadPhotosInGalleryFromEvent = async (event, id) => {
        event.preventDefault();
      
        await Array.from(event.target.files).forEach(async (file) => {
            const files = new FormData();
            const queueId = galleryState.CreateLoadingPhoto(id);

            files.append('file', file);
            files.append('albumId', id ? id : "");
            files.append('queueId', queueId);

            await instance
            .post(`/api/gallery/upload`, files)
            .catch((error) => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
                galleryState.DeleteLoadingPhoto(queueId);
            });
        });
    }

    static AddSelectedPhotosInAlbum = async (selected, activeItems) => {
        if (selected && selected[0] && selected[0].id) {
            (async () => {
                for (let i = 0; i < activeItems.length; i++) {
                    if (activeItems[i] && activeItems[i].id) {
                        await instance
                        .post(`/api/albums?fileId=${activeItems[i].id}&albumId=${selected[0].id}`)
                        .catch(response => {
                            console.error(response);
                        });
                    }
                }
            })();
        }
    }

    static UploadPhotosInAlbum = async (files, folderId, albumId) => {
        files = files.target.files;
        
        await Array.from(files).forEach(async (file) => {
            let type = null;
    
            if (file.type) {
                type = file.type.split('/');
    
                if (type.length === 2) {
                    type = type[1];
                } else{
                    type = null;
                }
            }
    
            const form = new FormData();
            const fileName = file.name ? file.name : null;
            const queueId = await storageState.CreateLoadingFile(fileName, folderId, type);
    
            form.append('file', file);
            form.append('folderId', folderId ? folderId : "");
            form.append('queueId', queueId);
            form.append('albumId', albumId);
    
            await instance
                .post('api/albums/upload', form)
                .catch(error => {
                    applicationState.AddErrorInQueue('Attention!', error.response.data);
                    storageState.DeleteLoadingFile(queueId, file.folderId);
                });
        })
    };
}

export default GalleryController;