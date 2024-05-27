import { makeAutoObservable } from "mobx";
import FileAPI from "../services/cloud/api/FileAPI";

class MusicState {
    songQueue = []
    currentSongIndex = 0;
    isPlaying = false;
    loadPercentage = 0;
    repeatState = 0;
    time = 0;

    constructor() {
        makeAutoObservable(this);
    }

    SetSongQueue(songs) {
        if (songs && songs.filter) {
            this.songQueue = songs.filter(element => FileAPI
                .musicTypes.includes(element.type));
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

    setTime(timeValue) {
        const isExist = this.songQueue.length > 0 && this.songQueue[this.currentSongIndex] && 
            this.songQueue[this.currentSongIndex].id;

        if (isExist) {
            if (this.songQueue[this.currentSongIndex].durationTicks) {
                this.time = timeValue;
            }
        }
    }

    ChangePlayingState() {
        this.isPlaying = !this.isPlaying;
    }

    GetCurrentSongId() {
        if (this.songQueue[this.currentSongIndex] && this.songQueue[this.currentSongIndex].id) {
            return this.songQueue[this.currentSongIndex].id;
        }

        return null;
    }

    setProgress(progress) {
        this.loadPercentage = progress;
    }

    DeleteSong = (id) => {
        if (id) {
            this.songQueue = this.songQueue.filter(x => x.id !== id);
        }
    }

    NextRepeatState = () => {
        if (this.repeatState + 1 >= 3) {
            this.repeatState = 0;
            return;
        }
        
        this.repeatState++;
    }

    HandleRepeatStateOne = () => {
        this.time = 0;

        if (this.songQueue.length - 1 <= this.currentSongIndex) {

            this.isPlaying = false;
        } else {
            this.currentSongIndex++;
        }
    }

    HandleRepeatStateTwo = () => {
        this.time = 0;

        if (this.songQueue.length - 1 <= this.currentSongIndex) {
            this.time = 0;
            this.currentSongIndex = 0;
        } else {
            this.currentSongIndex++;
        }
    }

    HandleRepeatStateThree = () => {
        this.time = 0;
    }

    TurnOnNextSong = () => {
        const callbacks = [this.HandleRepeatStateOne, this.HandleRepeatStateTwo, this.HandleRepeatStateThree];
        callbacks[this.repeatState]();
    }
}

export default new MusicState();