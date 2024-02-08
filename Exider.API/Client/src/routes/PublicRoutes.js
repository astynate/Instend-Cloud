import Login from '././services/'

const PublicRoutes = [
    {
        path: '/accounts/login',
        element: <Login />
    },
    {
        path: '/accounts/create',
        element: <Create />
    },
    {
        path: '/accounts/confirm',
        element: <Confirm />
    }
];

export default PublicRoutes;
