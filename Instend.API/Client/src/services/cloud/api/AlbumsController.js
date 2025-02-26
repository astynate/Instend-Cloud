import { instance } from "../../../state/application/Interceptors";
import GalleryState from "../../../state/entities/GalleryState";

class AlbumsController {
    static ValidateAlbum = (name) => {
        if (name === '' || name === undefined || name === null) {
            return false;
        };

        return true;
    };

    static GetAlbum = async (id, skip = 0, take = 5, callback = () => {}) => {
        await instance
            .get(`/api/album?id=${id}&skip=${skip}&take=${take}`)
            .then(response => {
                if (response && response.data) {
                    callback(response.data);
                };
            });
    };

    static GetAlbums = async (skip, take) => {
        await instance
            .get(`/api/albums?skip=${skip}&take=${take}`)
            .then(response => {
                if (response.data) {
                    GalleryState.AddAlbums(response.data);
                    GalleryState.setHasMoreAlbumsState(response.data >= 5);
                };
            });
    };

    GetAlbumPhotos = async (id) => {
        if (this.albums[id] && this.albums[id].hasMore === true) {
            const count = 15;
            this.albums[id].hasMore = false;

            await instance
                .get(`/api/album?id=${id}&from=${this.albums[id].photos.length > 0 ? this.albums[id].photos.length : 0}&count=${count}`)
                .then(response => {
                    if (!response || !response.data || !response.data.length || !response.data.length === 0) {
                        return;
                    }

                    this.albums[id].hasMore = response.data.length !== 0;

                    this.albums[id].photos = [...response.data.map(element => {
                        if (element && element.file && element.meta !== undefined) {
                            return {...element.file, ...element.meta, strategy: 'file', preview: element.file.fileAsBytes};
                        } else {
                            return null;
                        }
                    }).filter(element => element !== null), ...this.albums[id].photos];
                })
                .catch((error) => {
                    console.error(error.response.data);
                });
        };
    };

    static CreateAlbum = async (name, description, image, route='/api/albums/create') => {
        if (AlbumsController.ValidateAlbum(name) === false)
            return false;
    
        let form = new FormData();
    
        form.append("name", name);
        form.append("description", description);
        form.append("cover", image);
    
        await instance({
            method: 'post',
            url: route,
            data: form,
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then(response => {
            if (response && response.data && response.data[0]) {
                GalleryState.AddAlbums([response.data[0]]);
            };
        });
    };

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
        });
    };

    static DeleteAlbums = async (albums) => {
        if (albums && albums.length <= 0) {
            return false;
        };

        for (let i = 0; i < albums.length; i++) {
            if (albums[i].id) {
                GalleryState.SetAlbumAsLoading(albums[i].id);
                await instance.delete(`/api/albums?id=${albums[i].id}`);
            };
        }
    };
};

export default AlbumsController;