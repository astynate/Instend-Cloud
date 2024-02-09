import Cloud from '../services/cloud/pages/cloud/Cloud';
import Explore from '../services/cloud/pages/explore/Explore';
import Friends from '../services/cloud/pages/friends/Friends';
import Gallery from '../services/cloud/pages/gallery/Gallery';
import Home from '../services/cloud/pages/home/Home';
import Messages from '../services/cloud/pages/messages/Messages';
import Music from '../services/cloud/pages/music/Music';
import Profile from '../services/cloud/pages/profile/Profile';

const PrivateRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/cloud',
        element: <Cloud />
    },
    {
        path: '/explore',
        element: <Explore />
    },
    {
        path: '/friends',
        element: <Friends />
    },
    {
        path: '/gallery',
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
];

export default PrivateRoutes;