import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";

class GalleryState {
    hasMore = true;
    photos = [];
    albums = {};

    constructor() {
        makeAutoObservable(this);
    }

    AddPhoto(photo) {
        this.photos = [photo, ...this.photos];
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

    SortPhotosByDate(ording) {
        if (ording === true) {
            this.photos = toJS(this.photos).sort((a, b) => 
                a.name.localeCompare(b.name));
        } else {
            this.photos = toJS(this.photos).sort((a, b) => 
                b.name.localeCompare(a.name));
        }
    }

    SortPhotosByName(ording) {
        if (ording === true) {
            this.photos = toJS(this.photos).sort((a, b) => 
                new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
            );
        } else {
            this.photos = toJS(this.photos).sort((a, b) => 
                new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
            );
        } 
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
}

export default new GalleryState();