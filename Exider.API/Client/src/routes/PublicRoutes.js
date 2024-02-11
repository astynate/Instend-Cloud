import Login from '../services/accounts/pages/login/Login';
import Confirm from '../services/accounts/pages/confirm/Confirm';
import { Registration } from '../services/accounts/processes/Registration';


const PublicRoutes = [
    {
        path: '/account/login',
        element: <Login />
    },
    {
        path: '/account/create/*',
        element: <Registration />
    },
    {
        path: '/account/confirm',
        element: <Confirm />
    }
];

export default PublicRoutes;
