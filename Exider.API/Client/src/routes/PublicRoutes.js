import Login from '../services/accounts/pages/login/Login';
import Confirm from '../services/accounts/pages/confirm/Confirm';
import { Registration } from '../services/accounts/processes/Registration';


const PublicRoutes = [
    {
        path: 'login',
        element: <Login />
    },
    {
        path: 'create/*',
        element: <Registration />
    },
    {
        path: 'email/confirmation/:id',
        element: <Confirm />
    }
];

export default PublicRoutes;
