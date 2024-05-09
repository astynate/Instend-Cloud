import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";

class GalleryState {

    //////////////////////////////////////////////////////////////////////////////////////

    hasMore = true;
    photos = [];
    albums = {};
    photoQueueId = 0;
    albumsQueueId = 0;

    //////////////////////////////////////////////////////////////////////////////////////

    constructor() {
        makeAutoObservable(this);
    }

    //////////////////////////////////////////////////////////////////////////////////////

    CreateLoadingPhoto(albumId) {
        const photo = {
            id: null,
            queueId: this.photoQueueId,
            isLoading: true,
            strategy: 'loading',
        }

        runInAction(() => {
            if (albumId !== null && albumId !== '' && this.albums[albumId] && this.albums[albumId]) {
                this.albums[albumId].photos = [photo, ...this.albums[albumId].photos];
            }

            this.photos = [photo, ...this.photos];
            this.photoQueueId++;
        });

        return photo.queueId;
    }

    ReplaceLoadingPhoto(photo, queueId) {
        photo.strategy = 'file';

        runInAction(() => {
            const index = this.photos.findIndex(element => element.queueId === queueId);

            if (index === -1) {
                this.photos = [photo, ...this.photos];         
            } else {
                this.photos[index] = photo;
            }
        });
    }

    DeleteLoadingPhoto(queueId) {
        this.photos = this.photos
            .filter(element => element.queueId !== queueId);
    }

    DeletePhoto(data) {
        this.photos = this.photos
            .filter(element => element.id !== data);
    }

    async GetPhotos() {
        this.hasMore = false;
        const response = await instance.get(`api/gallery?from=${this.photos.length > 0 ? this.photos.length : 0}&count=${5}`);
    
        if (response.data.length < 1) {
            this.hasMore = false;
            return;
        }

        this.hasMore = true;
        this.photos.push(...response.data);
    }; 

    //////////////////////////////////////////////////////////////////////////////////////

    AddAlbum(album) {
        if (album) {
            album.photos = []
            album.hasMore = true;
    
            this.albums[album.id] = album;
        }
    }

    AddToAlbum(photo, id) {
        if (this.albums[id] && this.albums[id].photos) {
            this.albums[id].photos = [photo, ...this.albums[id].photos];
        }
    }

    async GetAlbums() {
        await instance
            .get('/api/albums')
            .then(response => {
                for (let i = 0; i < response.data.length; i++) {
                    if ((response.data[i].id in this.albums) === false) {
                        response.data[i].photos = []
                        response.data[i].hasMore = true;

                        this.albums[response.data[i].id] = response.data[i];
                    }
                }
            })
    }

    ////////////////////////////////////////////////////////////////////////////////////// 

    SortPhotosByDate(ording) {
        if (this.photos.length <= 1) {
            return;
        }

        try {
            if (ording === true) {
                this.photos = toJS(this.photos).sort((a, b) => 
                    a.name.localeCompare(b.name));
            } else {
                this.photos = toJS(this.photos).sort((a, b) => 
                    b.name.localeCompare(a.name));
            }
        } catch {

        }
    }

    SortPhotosByName(ording) {
        if (this.photos.length <= 1) {
            return;
        }

        try {
            if (ording === true) {
                this.photos = toJS(this.photos).sort((a, b) => 
                    new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
                );
            } else {
                this.photos = toJS(this.photos).sort((a, b) => 
                    new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
                );
            } 
        } catch {}
    }

    async GetAlbumPhotos(id) {
        if (this.albums[id] && this.albums[id].hasMore === true) {
            const count = 5;

            await instance
                .get(`/api/album?id=${id}&from=${this.albums[id].photos.length > 0 ? this.albums[id].photos.length : 0}&count=${5}`)
                .then(response => {
                    if (response.data < count) {
                        this.albums[id].hasMore = false;
                    }
                    this.albums[id].photos = [...this.albums[id].photos, ...response.data];
                })
                .catch((error) => {
                    console.error(error);
                })
        }
    }

    ////////////////////////////////////////////////////////////////////////////////////// 
}

export default new GalleryState();