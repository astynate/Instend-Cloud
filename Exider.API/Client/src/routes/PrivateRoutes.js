import Cloud from '../services/cloud/pages/cloud/layout/Cloud';
import Explore from '../services/cloud/pages/explore/Explore';
// import Friends from '../services/cloud/pages/friends/Friends';
import Gallery from '../services/cloud/pages/gallery/layout/Gallery';
import Home from '../services/cloud/pages/home/Home';
import Messages from '../services/cloud/pages/messages/layout/Messages';
import Music from '../services/cloud/pages/music/Music';
import Profile from '../services/cloud/pages/profile/layout/Profile';
import Settings from '../services/settings/layout/Settings';

const PrivateRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/cloud/:id?',
        element: <Cloud />
    },
    {
        path: '/explore',
        element: <Explore />
    },
    {
        path: '/gallery/*',
        element: <Gallery />
    },
    {
        path: '/messages',
        element: <Messages />
    },
    {
        path: '/music',
        element: <Music />
    },
    {
        path: '/profile',
        element: <Profile />
    },
    {
        path: '/settings/*',
        element: <Settings />
    },
];

export default PrivateRoutes;