import Playlist from "../services/cloud/pages/music/pages/playlist/Playlist";
import PrivateRoutes from "./PrivateRoutes";

export const SpecificRoutes = [
    {
        path: '/music/playlist/:id?',
        element: <Playlist />,
        name: "Playlist",
        isHeaderless: true,
    },
    ...[...PrivateRoutes].reverse(),
];