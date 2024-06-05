import { makeAutoObservable } from "mobx";

class ApplicationState {
    errorQueue = [];

    constructor() {
        makeAutoObservable(this);
    }

    AddErrorInQueue(title, message) {
        if (!message) {
            message = 'Something went wrong';
        }
        this.errorQueue = [...this.errorQueue, [title, message]];
    }

    RemoveErrorFromQueue() {
        this.errorQueue  = this.errorQueue.slice(1);
    }

    GetErrorFromQueue() {
        return this.errorQueue[0];
    }

    GetCountErrors() {
        return this.errorQueue.length;
    }
}

export default new ApplicationState();