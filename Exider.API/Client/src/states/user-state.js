import axios from "axios";
import { makeAutoObservable } from "mobx";

class UserState {

    isAccessibleRoute = false;
    isAuthorize = false;
    isLoading = true;
    userModel = {};

    constructor() {
        makeAutoObservable(this);
    }

    UpdateAuthorizeState = async (location, navigate) => {

        this.isLoading = true;
    
        const responsePromise = axios.get('/authentication', {
            params: {
                accessToken: localStorage.getItem('system_access_token')
            },
        });
    
        const timeoutPromise = new Promise((resolve) => {
            setTimeout(() => resolve({ status: 408 }), 5000);
        });
    
        try {
            
            const response = await Promise.race([responsePromise, timeoutPromise]);
    
            if (response.status === 200) {

                this.isAuthorize = true;
                localStorage.setItem('system_access_token', response.data);

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