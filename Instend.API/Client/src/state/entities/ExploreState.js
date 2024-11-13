import { makeAutoObservable } from "mobx";
// import { instance } from "../state/Interceptors";

class ExploreState {
    users = [];
    files = [];

    constructor() {
        makeAutoObservable(this);
    }

    GetUsers = async (prefix) => {
        // await instance
        //     .get(`/accounts/all/${prefix}`)
        //     .then(response => {
        //         if (response.data && response.data.length) {
        //             this.users = response.data;
        //         } else {
        //             this.users = [];
        //         }
        //     });
    }

    GetFiles = async (prefix) => {
        // await instance
        //     .get(`/api/files/${prefix}`)
        //     .then(response => {
        //         if (response.data && response.data.length) {
        //             this.files = response.data.map(file => 
        //             {
        //                 if (file.file !== undefined && file.meta !== undefined) {
        //                     return {...file.file, ...file.meta, strategy: 'file'}
        //                 } else {
        //                     return null;
        //                 }
        //             });
        //         } else {
        //             this.files = [];
        //         }
        //     });
    }
}

export default new ExploreState();