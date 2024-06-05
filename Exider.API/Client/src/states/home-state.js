import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";

class HomeState {
    communities = [];

    constructor() {
        makeAutoObservable(this);
    }

    GetPopularCommunities = async (from = 0, count = 20) => {
        await instance.get(`/api/community?from=${from}&count=${count}`)
            .then(response => {
                if (response.data && response.data.length > 0) {
                    this.communities = response.data;
                }
            });
    }
}

export default new HomeState();