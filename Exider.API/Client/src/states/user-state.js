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

    UpdateAuthorizeState = async (location, navigate) => {

        this.isLoading = true;
    
        const responsePromise = instance.get('/accounts');
    
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve({ status: 408 }), 5000);
        });
    
        try {
            
            const response = await Promise.race([responsePromise, timeoutPromise]);
    
            if (response.status === 200) {

                this.user = await response.data;
                this.isAuthorize = true;

                console.log(this.user);

            } else {
                this.isAuthorize = false;
                navigate('/account/login');
            }

        } catch (exception) {

            this.isAuthorize = false;
            navigate('/account/login');

        } finally {
            this.isLoading = false;
        }

    }
    
}

export default new UserState();