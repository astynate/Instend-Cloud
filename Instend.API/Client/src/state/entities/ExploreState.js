import { makeAutoObservable } from "mobx";

class ExploreState {
    accounts = [];
    friends = [];
    collections = [];
    files = [];

    constructor() {
        makeAutoObservable(this);
    };

    setAccounts = (accounts) => {
        this.accounts = accounts ?? [];
    };

    setFriends = (friends) => {
        console.log(friends);
        this.friends = friends ?? [];
    };

    setCollections = (collections) => {
        this.collections = collections ?? [];
    };

    setFiles = (files) => {
        this.files = files ?? [];
    };
};

export default new ExploreState();