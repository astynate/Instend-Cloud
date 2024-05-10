/////////////////////////////////////////////////////////////////////////////////////

import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import galleryState from "../../../../../states/gallery-state";

/////////////////////////////////////////////////////////////////////////////////////

export const CreateAlbumRequest = async (name, description, image) => {
    if (name === '') {
        return;
    }

    let form = new FormData();
    const queueId = galleryState.CreateLoadingAlbum(name);

    form.append("name", name);
    form.append("description", description);
    form.append("cover", image);
    form.append("queueId", queueId);

    await instance({
        method: 'post',
        url: '/api/gallery',
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
    }).catch((error) => {
        applicationState.AddErrorInQueue('Attention!', error.response.data);
        galleryState.DeleteAlbumById(queueId);
    });
}

/////////////////////////////////////////////////////////////////////////////////////

export const DeleteAlbums = async (albums) => {
    if (albums && albums.length > 0) {
        for (let i = 0; i < albums.length; i++) {
            if (albums[i].id) {
                galleryState.SetAlbumAsLoading(albums[i].id);

                await instance
                    .delete(`/api/albums?id=${albums[i].id}`)
                    .catch((error) => {
                        applicationState.AddErrorInQueue('Attention!', error.response.data);
                        galleryState.SetAlbumAsNormal(albums[i]);
                    });
            }
        }
    }
}

/////////////////////////////////////////////////////////////////////////////////////