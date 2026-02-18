import Explore from '../services/cloud/pages/explore/layout/Explore';
import Gallery from '../services/cloud/pages/gallery/layout/Gallery';
import Home from '../services/cloud/pages/home/layout/Home';
import PublicationPage from '../services/cloud/pages/publication/PublicationPage';
import Messages from '../services/cloud/pages/messages/layout/Messages';
import Music from '../services/cloud/pages/music/layout/Music';
import Profile from '../services/cloud/pages/profile/layout/Profile';
import Settings from '../services/settings/layout/Settings';
import Album from '../services/cloud/pages/gallery/pages/album/Album';
import CollectionPage from '../services/cloud/pages/collection/layout/CollectionPage';

const PrivateRoutes = [
    {
        index: true,
        path: '/*',
        element: <Home />,
        name: "Home"
    },
    {
        index: true,
        path: '/publication/:id?',
        element: <PublicationPage />,
        name: "Publication"
    },
    {
        path: '/collection/:id?',
        element: <CollectionPage />,
        name: "Collection",
        search: {}
    },
    {
        path: '/explore/*',
        element: <Explore />,
        name: "Explore"
    },
    {
        path: '/gallery/*',
        element: <Gallery />,
        name: "Gallery"
    },
    {
        path: '/messages/:id',
        element: <Messages />,
        name: "Messages",
        isHeaderless: true,
        isWithoutBottomPanel: true,
    },
    {
        path: '/messages',
        element: <Messages />,
        name: "Messages"
    },
    {
        path: '/music/*',
        element: <Music />,
        name: "Music"
    },
    {
        path: '/profile/:id?',
        element: <Profile />,
        name: "Profile"
    },
    {
        path: '/album/:id?',
        element: <Album />,
        name: "Album"
    },
    {
        path: '/settings/*',
        element: <Settings />,
        name: "Settings"
    }
];

export default PrivateRoutes;