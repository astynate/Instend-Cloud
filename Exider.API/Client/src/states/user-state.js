import { instance } from '../state/Interceptors';
import { makeAutoObservable } from "mobx";

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
            const response = await instance.get('/accounts');

            if (response.status === 200) {
                this.user = await response.data;
                this.isAuthorize = true;
            } 
            
            else {
                this.isAuthorize = false;
                navigate('/account/login');
            }

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
}

export default new UserState();