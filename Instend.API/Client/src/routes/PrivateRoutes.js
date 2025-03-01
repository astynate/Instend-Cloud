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
        path: '/cloud/*',
        element: <Cloud />,
        name: "Cloud",
        search: {
            
        }
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
        path: '/messages/:id?',
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
        path: '/settings/*',
        element: <Settings />,
        name: "Settings"
    }
];

export default PrivateRoutes;