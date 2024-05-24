/////////////////////////////////////////////////////////////////////////////////////

import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import galleryState from "../../../../../states/gallery-state";

/////////////////////////////////////////////////////////////////////////////////////

export const CreateAlbumRequest = async (route='/api/albums/create', name, description, image) => {
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
        url: route,
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
    }).catch((error) => {
        applicationState.AddErrorInQueue('Attention!', error.response.data);
        galleryState.DeleteAlbumById(queueId);
    });
}

/////////////////////////////////////////////////////////////////////////////////////

export const UpdateAlbum = async (route, name, description, image, id) => {
    if (name === '') {
        return;
    }

    let form = new FormData();

    form.append("id", id);
    form.append("name", name);
    form.append("description", description);
    form.append("cover", image);

    await instance({
        method: 'put',
        url: route,
        data: form,
        headers: { 'Content-Type': 'multipart/form-data' },
    }).catch((error) => {
        applicationState.AddErrorInQueue('Attention!', error.response.data);
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

export const DeleteComment = async (id, albumId) => {
    galleryState.SetCommentAsLoading(id);

    if (id) {
        await instance
            .delete(`/api/album-comments?id=${id}&albumId=${albumId}`)
            .catch((error) => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
                galleryState.SetCommentAsLoading(id);
            });
    }
}

/////////////////////////////////////////////////////////////////////////////////////