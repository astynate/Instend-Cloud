import i18next from "i18next";
import { makeAutoObservable } from "mobx";

class ApplicationState {
    errorQueue = [];
    connectionState = 0;
    language = 'en-UK';
    theme = 'dark-mode';
    isMobile = false;

    constructor() {
        this.language = localStorage.getItem('language') ?? 'en-UK';
        this.theme = localStorage.getItem('color-mode') ?? 'dark-mode';

        makeAutoObservable(this);
    }

    ChangeLanguage(language) {
        i18next.changeLanguage(language, () => {
            localStorage.setItem('language', language);
            this.language = language;
        });
    }

    ChangeTheme = (theme) => {
        localStorage.setItem('color-mode', theme);
        this.theme = theme;
    }

    AddErrorInQueue = (title, message) => {
        this.errorQueue = [
            ...this.errorQueue, 
            [
                title, 
                message ?? 'Something went wrong'
            ]
        ];
    }

    AddErrorInQueueByError(title, error) {
        if (error && error.response && error.response.data) {
            this.AddErrorInQueue(title, error.response.data);
        } else {
            this.AddErrorInQueue(title, null);
        }
    }

    SetConnectionState = (state) => this.connectionState = state;
    RemoveErrorFromQueue = () => this.errorQueue = this.errorQueue.slice(1);
    GetErrorFromQueue = () => this.errorQueue[0];
    GetCountErrors = () => this.errorQueue.length;
    setIsMobile = (state) => this.isMobile = state;
}

export default new ApplicationState();