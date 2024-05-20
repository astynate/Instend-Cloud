import { makeAutoObservable } from "mobx";
import FileAPI from "../services/cloud/api/FileAPI";

class MusicState {
    songQueue = []
    currentSongIndex = 0;
    isPlaying = false;

    constructor() {
        makeAutoObservable(this);
    }

    SetSongQueue(songs) {
        if (songs && songs.filter) {
            this.songQueue = songs.filter(element => element.type ? 
                FileAPI.musicTypes.includes(element.type) : null);
        }
    }

    SetSongAsPlaying(id) {
        const index = this.songQueue.findIndex(element => element.id === id);

        if (index === this.currentSongIndex) {
            this.isPlaying = !this.isPlaying;
            return;
        }

        if (index === -1) {
            this.songQueue = [...this.songQueue, {id: id}];
            this.currentSongIndex = this.songQueue.length - 1;
        } else {
            this.currentSongIndex = index;
        }

        this.isPlaying = true;
    }

    ChangePlayState() {
        this.isPlaying = !this.isPlaying;
    }

    GetCurrentSongId() {
        if (this.songQueue[this.currentSongIndex] && this.songQueue[this.currentSongIndex].id) {
            return this.songQueue[this.currentSongIndex].id;
        }

        return null;
    }
}

export default new MusicState();