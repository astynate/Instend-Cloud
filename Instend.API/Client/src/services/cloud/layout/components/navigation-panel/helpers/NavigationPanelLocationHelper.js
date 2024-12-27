import { useLocation } from "react-router-dom";

export const useIsActiveButton = (name) => 
    useIsCurrentRoute(name) ? 'active' : 'passive'

export const useIsCurrentRoute = (name) => 
    useLocation()['pathname'] === '/' + name;