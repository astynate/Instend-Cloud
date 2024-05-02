import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";

class GalleryState {
    hasMore = true;
    photos = [];
    albums = [];

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
        const response = await instance.get('/api/albums');
        this.albums = response.data;
    }
}

export default new GalleryState();