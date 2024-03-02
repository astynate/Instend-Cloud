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

        const responsePromise = instance.get('/accounts');
    
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve({ status: 408 }), 5000);
        });
    
        try {
            
            const response = await Promise.race([responsePromise, timeoutPromise]);
    
            if (response.status === 200) {

                this.user = await response.data;
                this.isAuthorize = true;

            } else {
                this.isAuthorize = false;
                navigate('/account/login');
            }

        } catch (exception) {

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