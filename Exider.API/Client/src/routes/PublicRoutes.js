import Login from '../services/accounts/pages/login/Login';
import Create from '../services/accounts/pages/create/Create';
import Confirm from '../services/accounts/pages/confirm/Confirm';


const PublicRoutes = [
    {
        path: '/login',
        element: <Login />
    },
    {
        path: '/create',
        element: <Create />
    },
    {
        path: '/confirm',
        element: <Confirm />
    }
];

export default PublicRoutes;
