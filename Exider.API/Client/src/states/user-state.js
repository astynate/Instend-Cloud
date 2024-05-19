import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";
import storageState from './storage-state';

class UserState {
    isAccessibleRoute = false;
    isAuthorize = false;
    isLoading = true;
    user = null;

    constructor() {
        makeAutoObservable(this);
    }

    UpdateUserData = async (location, navigate) => {
        try {
            await instance.get('/accounts')
                .then(response => {
                    this.user = response.data;
                    this.isAuthorize = true;
                })
                .catch(() => {
                    this.isAuthorize = false;
                    navigate('/account/login');
                });

            await storageState.SetFolderItemsById(null);
        } 
        catch (exception) {
            this.isAuthorize = false;
            navigate('/account/login');
        }
    }

    UpdateAuthorizeState = async (location, navigate) => {
        this.isLoading = true;
        await this.UpdateUserData(location, navigate);
        this.isLoading = false;
    }

    ChangeOccupiedSpace(occupiedSpace) {
        if (this.user) {
            this.user.occupiedSpace = occupiedSpace;
        }
    }
}

export default new UserState();