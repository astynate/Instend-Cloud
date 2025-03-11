import { makeAutoObservable } from "mobx";
import GlobalContext from "../../global/GlobalContext";

class MusicState {
    songQueue = []
    currentSongIndex = 0;
    isPlaying = false;
    loadPercentage = 0;
    repeatState = 0;
    time = 0;
    duration = 0;

    constructor() {
        makeAutoObservable(this);
    };

    SetCurrentSongIndex = (index) => {
        this.currentSongIndex = index;
    };

    setDuration = (duration) => {
        if (!duration) {
            return;
        }

        this.duration = duration;
    }

    GetCurrentSongData = () => {
        const defaultSong = {
            id: undefined,
            name: 'Song is not selected',
            artist: 'Artist',
            album: 'Album'
        };

        if (this.songQueue.length === 0)
            return defaultSong;

        const song = this.songQueue[this.currentSongIndex];
        
        if (!song)
            return defaultSong;

        return {
            id: song.id,
            name: song.name ? song.name : 'Untitled song',
            artist: song.artist ? song.artist : 'Unknown',
            album: song.album ? song.album : 'Album',
        };
    }

    IsSongIsPlaying = (id) => {
        if (this.isPlaying === false) {
            return false;
        }

        if (!this.songQueue || this.songQueue.length === 0) {
            return false;
        }

        return this.songQueue[this.currentSongIndex].id === id;
    };

    SetSongQueue = (songs) => {
        if (!songs || !songs.filter) {
            return;
        }

        this.setTime(0);

        this.songQueue = songs
            .filter(element => GlobalContext.supportedMusicTypes.includes(element.type));
    };

    setPlayingState = (state) => {
        this.isPlaying = state;
    };

    SetSongAsPlaying = (song) => {
        const index = this.songQueue
            .findIndex(element => element.id === song.id);

        if (index === this.currentSongIndex) {
            this.isPlaying = !this.isPlaying;
            return;
        }

        if (index === -1) {
            this.songQueue = [...this.songQueue, song];
            this.currentSongIndex = this.songQueue.length - 1;
        } else {
            this.currentSongIndex = index;
        };

        this.setTime(0);
        this.isPlaying = true;
    };

    setTime = (timeValue) => {
        this.time = timeValue ?? 0;
    };

    ChangePlayingState = () => {
        if (this.songQueue.length > 0) {
            this.isPlaying = !this.isPlaying;
            return;
        }
        
        this.isPlaying = false;
    };

    GetCurrentSongId = () => {
        if (this.songQueue[this.currentSongIndex] && this.songQueue[this.currentSongIndex].id) {
            return this.songQueue[this.currentSongIndex].id;
        }

        return null;
    };

    setProgress = (progress) => {
        this.loadPercentage = progress;
    };

    DeleteSong = (id) => {
        if (id) {
            this.songQueue = this.songQueue.filter(x => x.id !== id);
        }
    };

    NextRepeatState = () => {
        if (this.repeatState + 1 >= 3) {
            this.repeatState = 0;
            return false;
        }
        
        this.repeatState++;
    };

    HandleRepeatStateOne = () => {
        this.time = 0;

        if (this.songQueue.length - 1 <= this.currentSongIndex) {
            this.isPlaying = false;
        } else {
            this.currentSongIndex++;
        }
    };

    HandleRepeatStateTwo = () => {
        this.time = 0;

        if (this.songQueue.length - 1 <= this.currentSongIndex) {
            this.time = 0;
            this.currentSongIndex = 0;
        } else {
            this.currentSongIndex++;
        }
    };

    HandleRepeatStateThree = () => {
        this.time = 0;
    };

    TurnOnNextSong = () => {
        const callbacks = [
            this.HandleRepeatStateOne, 
            this.HandleRepeatStateTwo, 
            this.HandleRepeatStateThree
        ];
        
        callbacks[this.repeatState]();
    };
};

export default new MusicState();