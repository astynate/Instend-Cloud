import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";
import storageState from './storage-state';

class UserState {
    isAccessibleRoute = false;
    friends = []
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
                    if (response.data && response.data.length > 1) {
                        this.user = response.data[0];
                        this.friends = response.data[1];
                        this.isAuthorize = true;
                    } else {
                        throw new Error("Insufficient data received");
                    }
                })
                .catch((error) => {
                    console.error(error);
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