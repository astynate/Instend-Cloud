import { makeAutoObservable } from "mobx";

class ApplicationState {
    errorQueue = [];
    connectionState = 0;

    constructor() {
        makeAutoObservable(this);
    }

    SetConnectionState(state) {
        this.connectionState = state;
    }

    AddErrorInQueue(title, message) {
        if (!message) {
            message = 'Something went wrong';
        }
        this.errorQueue = [...this.errorQueue, [title, message]];
    }

    AddErrorInQueueByError(title, error) {
        if (error && error.response && error.response.data) {
            this.AddErrorInQueue(title, error.response.data);
        } else {
            this.AddErrorInQueue(title, null);
        }
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