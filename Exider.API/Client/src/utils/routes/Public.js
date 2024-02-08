import Cloud from './routes/cloud/Cloud';
import Explore from './routes/explore/Explore';
import Friends from './routes/friends/Friends';
import Gallery from './routes/gallery/Gallery';
import Home from './routes/home/Home';
import Messages from './routes/messages/Messages';
import Music from './routes/music/Music';
import Profile from './routes/profile/Profile';

const AppRoutes = [
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

export default AppRoutes;
