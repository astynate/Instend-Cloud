import { makeAutoObservable, runInAction } from "mobx";

class GalleryState {
    albums = [];
    albumsQueueId = 0;
    albumCommentQueueId = 0;
    isHasMoreAlbums = true;
    isHasMorePlaylists = true;

    constructor() {
        makeAutoObservable(this);
    };

    setHasMoreAlbumsState = (state) => {
        this.isHasMoreAlbums = state;
    };

    AddAlbums = (newAlbums = []) => {
        this.albums = [...this.albums, ...newAlbums];
    };

    AddToAlbum(photo, albumId) {
        runInAction(() => {
            if (albumId !== null && albumId !== '' && this.albums[albumId] && this.albums[albumId].photos) {
                this.albums[albumId].photos = [photo, ...this.albums[albumId].photos];
            };
        });
    };

    SetCommentQueueId = (id) => {
        this.albumCommentQueueId = id;
    };

    CreateLoadingAlbum(name) {
        const album = {
            id: null,
            name: name,
            queueId: this.albumsQueueId,
            isLoading: true,
            strategy: 'loading',
        };

        runInAction(() => {
            this.albums[this.albumsQueueId] = album;
            this.albumsQueueId++;
        });

        return album.queueId;
    };

    UpdateAlbum(id, coverAsBytes, name, description) {
        if (this.albums[id]) {
            if (coverAsBytes !== null && coverAsBytes !== '' && coverAsBytes !== undefined) {
                this.albums[id].cover = coverAsBytes;
            }
            this.albums[id].name = name;
            this.albums[id].description = description;
        };
    };

    ReplaceLoadingAlbum(album, queueId) {
        if (album) {
            album.photos = []
            album.hasMore = true;
    
            delete this.albums[queueId];
            this.albums[album.id] = album;
        };
    };

    SetAlbumAsLoading(id) {
        if (this.albums[id]) {
            this.albums[id].isLoading = true;
        };
    };

    SetAlbumAsNormal(id) {
        if (this.albums[id]) {
            this.albums[id].isLoading = false;
        };
    };

    DeleteAlbumById(id) {
        delete this.albums[id];
    };

    SetComments = (id, commets) => {
        if (this.albums[id] && this.albums[id].comments) {
            this.albums[id].comments = commets;
        };
    };

    ReplaceLoadingComment(comment, queueId, albumId) {
        if (this.albums[albumId] && this.albums[albumId].comments && this.albums[albumId].comments.map) {
            this.albums[albumId].comments = this.albums[albumId].comments.map(element => {
                if (element.queueId === queueId){
                    element = comment;
                }

                return element;
            });
        };
    };

    DeleteComment(id, albumId) {
        if (this.albums[albumId] && this.albums[albumId].comments) {
            this.albums[albumId].comments = this.albums[albumId].comments
                .filter(element => element.comment.id !== id);
        };
    };

    DeleteCommentByQueueId(queueId, albumId) {
        if (this.albums[albumId] && this.albums[albumId].comments) {
            this.albums[albumId].comments.filter(element => element.queueId !== queueId);
        };
    };

    SetCommentAsLoading(id) {
        Object.entries(this.albums).forEach(([key, _]) => {
            if (this.albums[key].comments) {
                this.albums[key].comments = this.albums[key].comments
                    .map(element => {
                        if (element.id === id) {
                            element.isUploading = true;
                        }
                        return element;
                    });
            };
        });
    };

    SetCommentAsNormal(id) {
        Object.entries(this.albums).forEach(([key, _]) => {
            if (this.albums[key].comments) {
                this.albums[key].comments = this.albums[key].comments
                    .map(element => {
                        if (element.id === id) {
                            element.isUploading = false;
                        }
                        return element;
                    });
            };
        });
    };

    DeleteCommentById(id) {
        Object.entries(this.albums).forEach(([key, _]) => {
            if (this.albums[key].comments) {
                this.albums[key].comments = this.albums[key].comments
                    .filter(element => element.comment.id !== id);
            };
        });
    };

    SetAlbumAccess(users, albumId) {
        if (this.albums[albumId] && users) {
            this.albums[albumId].users = []

            if (users.length) {
                this.albums[albumId].users = [...users, ...this.albums[albumId].users];
            } else {
                users.isOwner = true;
                this.albums[albumId].users = [users, ...this.albums[albumId].users];
            };
        };
    };

    DeleteAlbumUsers(albumId) {
        if (this.albums[albumId] && this.albums[albumId].users) {
            delete this.albums[albumId].users;
        };
    };

    UpdateAlbumViews(id, views) {
        if (this && this.albums && this.albums[id] && this.albums[id].views) {
            this.albums[id].views = views;
        };
    };
};

export default new GalleryState();