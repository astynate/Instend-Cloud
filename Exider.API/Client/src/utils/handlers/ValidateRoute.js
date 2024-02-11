const ValidateRoute = (PublicRoutes, isAuthenticated, location) => {

    const isPublicRoute = PublicRoutes
        .some(route => route.path === location.pathname);

    return !(isPublicRoute === false && isAuthenticated === false);

}

export default ValidateRoute;