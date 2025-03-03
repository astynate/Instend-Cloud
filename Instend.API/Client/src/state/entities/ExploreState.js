import { makeAutoObservable } from "mobx";

class ExploreState {
    accounts = [];
    files = [];

    constructor() {
        makeAutoObservable(this);
    };

    setAccounts = (accounts) => {
        this.accounts = accounts ?? [];
    };
};

export default new ExploreState();