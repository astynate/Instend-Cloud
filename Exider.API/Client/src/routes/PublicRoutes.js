import Login from '../services/accounts/pages/login/Login';
import Create from '../services/accounts/pages/create/Create';
import Confirm from '../services/accounts/pages/confirm/Confirm';


const PublicRoutes = [
    {
        path: '/account/login',
        element: <Login />
    },
    {
        path: '/account/create',
        element: <Create />
    },
    {
        path: '/account/confirm',
        element: <Confirm />
    }
];

export default PublicRoutes;
