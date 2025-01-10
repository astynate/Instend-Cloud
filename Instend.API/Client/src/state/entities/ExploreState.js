import { makeAutoObservable } from "mobx";

class ExploreState {
    accounts = [];
    files = [];

    constructor() {
        makeAutoObservable(this);
    }

    setAccounts = (accounts) => {
        if (accounts && accounts.length > 0) {
            this.accounts = accounts;
            console.log(this.accounts);
        }
    }
}

export default new ExploreState();