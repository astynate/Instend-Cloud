const ValidateRoute = (PublicRoutes, isAuthenticated, location) => {

    const isPublicRoute = PublicRoutes
        .some(route => location.pathname.includes(route.path.replace('*', '')));

    return !(isPublicRoute === false && isAuthenticated === false);

}

export default ValidateRoute;