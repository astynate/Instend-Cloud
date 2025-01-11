import Cloud from '../services/cloud/pages/cloud/layout/Cloud';
import Explore from '../services/cloud/pages/explore/layout/Explore';
import Gallery from '../services/cloud/pages/gallery/layout/Gallery';
import Home from '../services/cloud/pages/home/layout/Home';
import PublicationPage from '../services/cloud/pages/publication/PublicationPage';
import Messages from '../services/cloud/pages/messages/layout/Messages';
import Music from '../services/cloud/pages/music/layout/Music';
import Profile from '../services/cloud/pages/profile/layout/Profile';
import Settings from '../services/settings/layout/Settings';

const PrivateRoutes = [
    {
        index: true,
        path: '/*',
        element: <Home />
    },
    {
        index: true,
        path: '/publication/:id?',
        element: <PublicationPage />
    },
    {
        path: '/cloud/*',
        element: <Cloud />
    },
    {
        path: '/explore/*',
        element: <Explore />
    },
    {
        path: '/gallery/*',
        element: <Gallery />
    },
    {
        path: '/messages/:id?',
        element: <Messages />
    },
    {
        path: '/music/*',
        element: <Music />
    },
    {
        path: '/profile/:id?',
        element: <Profile />
    },
    {
        path: '/settings/*',
        element: <Settings />
    }
];

export default PrivateRoutes;