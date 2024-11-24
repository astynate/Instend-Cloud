const TransformPath = (route) => {
    return route.path.replace('*', '').replace('/:id', '').replace('?', '');
}

const ValidateRoute = (PrivateRoutes, isAuthenticated, location) => {
    const routes = PrivateRoutes.map(e => TransformPath(e));
    const isPrivateRoute = routes.some(e => location.includes(e));

    const isPrivateRouteAndUserAuthorized = isAuthenticated && isPrivateRoute
    const isPublicRoute = !isPrivateRoute;

    return isPublicRoute || isPrivateRouteAndUserAuthorized;
}

export default ValidateRoute;