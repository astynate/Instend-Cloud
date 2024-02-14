const TransformPath = (route) => {
    return route.path.replace('*', '').replace('/:id', '');
}

const ValidateRoute = (PublicRoutes, isAuthenticated, location) => {

    const isPublicRoute = PublicRoutes
        .some(route => location.pathname.includes(TransformPath(route)));

    return !(isPublicRoute === false && isAuthenticated === false);

}

export default ValidateRoute;