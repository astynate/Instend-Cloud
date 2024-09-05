import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import galleryState from "../../../../../states/gallery-state";
import storageState from "../../../../../states/storage-state";

//////////////////////////////////////////////////////////////////////////////////////

export const UploadPhotosInGallery = async (event, id) => {
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

//////////////////////////////////////////////////////////////////////////////////////

export const AddPhotosInAlbum = async (selected, activeItems) => {
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

//////////////////////////////////////////////////////////////////////////////////////

export const UploadPhotosInAlbum = async (files, folderId, albumId) => {
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

        const files = new FormData();
        const queueId = await storageState.CreateLoadingFile(file.name ? file.name : null, folderId, type);

        files.append('file', file);
        files.append('folderId', folderId ? folderId : "");
        files.append('queueId', queueId);
        files.append('albumId', albumId);

        await instance
            .post('api/albums/upload', files)
            .catch(error => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
                storageState.DeleteLoadingFile(queueId, file.folderId);
            });
    })
};

//////////////////////////////////////////////////////////////////////////////////////