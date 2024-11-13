class AlbumsController {
    static ValidateAlbum = (name) => {
        if (name === '' || name === undefined || name === null) {
            return false;
        }

        return true;
    }

    static CreateAlbum = async (route='/api/albums/create', name, description, image) => {
        if (AlbumsController.ValidateAlbum(name) === false)
            return false;
    
        let form = new FormData();
        let queueId = galleryState.CreateLoadingAlbum(name);
    
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

    static UpdateAlbum = async (name, description, image, id) => {
        if (AlbumsController.ValidateAlbum(name) === false)
            return false;
    
        let form = new FormData();
    
        form.append("id", id);
        form.append("name", name);
        form.append("description", description);
        form.append("cover", image);
    
        await instance({
            method: 'put',
            url: '/api/gallery',
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        }).catch((error) => {
            applicationState.AddErrorInQueue('Attention!', error.response.data);
        });
    }

    static DeleteAlbums = async (albums) => {
        if (albums && albums.length <= 0) {
            return false;
        }

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

    static DeleteComment = async (id, albumId) => {
        if (!!id === false)
            return false;

        galleryState.SetCommentAsLoading(id);
    
        await instance
            .delete(`/api/album-comments?id=${id}&albumId=${albumId}`)
            .catch((error) => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
                galleryState.SetCommentAsLoading(id);
            });
    }
}

export default AlbumsController;