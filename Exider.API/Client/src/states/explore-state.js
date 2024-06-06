import { makeAutoObservable } from "mobx";
import { instance } from "../state/Interceptors";

class ExploreState {
    users = [];

    constructor() {
        makeAutoObservable(this);
    }

    GetUsers = async (prefix) => {
        await instance
            .get(`/accounts/all/${prefix}`)
            .then(response => {
                if (response.data && response.data.length) {
                    this.users = response.data;
                } else {
                    this.users = [];
                }
            });
    }
}

export default new ExploreState();