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

    UpdateAuthorizeState = async(location, navigate) => {

        try {

            this.isLoading = true;

            const response = await axios.get('/authentication', {
                params: {
                    accessToken: localStorage.getItem('system_access_token')
                },
            });

            this.isAuthorize = response.status === 200;
            this.isLoading = false;

            if (ValidateRoute(PublicRoutes, this.isAuthorize, location) === false) {
                navigate('/account/login');
            }

            localStorage.setItem('system_access_token', response.data);

        } catch (exception) {

            this.isAuthorize = false;
            this.isLoading = false;

            navigate('/account/login');

        }

    }

}

export default new UserState();