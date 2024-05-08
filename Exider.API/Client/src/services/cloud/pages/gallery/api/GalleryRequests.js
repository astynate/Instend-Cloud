import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import galleryState from "../../../../../states/gallery-state";

//////////////////////////////////////////////////////////////////////////////////////

export const UploadPhotosInGallery = async (event, id) => {
    event.preventDefault();
  
    await Array.from(event.target.files).forEach(async (file) => {
      const files = new FormData();
      const queueId = galleryState.CreateLoadingPhoto();

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