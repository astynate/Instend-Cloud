import axios from "axios";
import { makeAutoObservable } from "mobx";
import ValidateRoute from "../utils/handlers/ValidateRoute";
import PublicRoutes from "../routes/PublicRoutes";

class UserState {

    isAccessibleRoute = false;
    isAuthorize = false;
    isLoading = true;

    constructor() {
        makeAutoObservable(this);
    }

    UpdateAuthorizeState = async() => {

        try {

            this.isLoading = true;

            const response = await axios.get('/authentication', {
                params: {
                    accessToken: localStorage.getItem('system_access_token')
                },
            });
    
            this.isAuthorize = response.status === 200;
            this.isAccessibleRoute = ValidateRoute(PublicRoutes, this.isAuthorize, window.location.href);
            this.isLoading = false;

            localStorage.setItem('system_access_token', response.data);

        } catch (exception) {

            console.error(exception);
            this.isLoading = false;

        }

    }

}

export default new UserState();