import React, { createContext, useCallback } from 'react'
import { useState, useEffect } from 'react';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import './css/animations.css';
import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { createSignalRContext } from "react-signalr/signalr";
import { observer } from 'mobx-react-lite';
import storageState from '../../../states/storage-state';
import galleryState from '../../../states/gallery-state';
import Information from '../shared/information/Information';
import applicationState from '../../../states/application-state';
import userState from '../../../states/user-state';
import MusicPlayer from '../widgets/music-player/MusicPlayer';
import musicState from '../../../states/music-state';
import { GetCurrentSong } from '../widgets/navigation-panel/NavigationPanel';
import chatsState from '../../../states/chats-state';
import { useNavigate } from 'react-router-dom';

export const messageWSContext = createSignalRContext();
export const storageWSContext = createSignalRContext();
export const galleryWSContext = createSignalRContext();
export const layoutContext = createContext(); 
export const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];

export const connectToFoldersListener = async () => {
    try {
        while (storageWSContext.connection.state !== 'Connected') {
            if (storageWSContext.connection.state === 'Disconnected') {
                await storageWSContext.connection.start();
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await storageWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
    } catch (error) {
        console.error('Failed to connect or join:', error);
    }
};

export const connectToDirectListener = async (id) => {
    try {
        while (messageWSContext.connection.state !== 'Connected') {
            if (messageWSContext.connection.state === 'Disconnected') {
                await messageWSContext.connection.start();
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        await messageWSContext.connection.invoke("ConnectToDirect", id, localStorage.getItem("system_access_token"));
    } catch (error) {
        console.error('Failed to connect or join:', error);
    }
};

const Layout = observer(() => {
    const handleLoading = () => setIsLoading(false);
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [song, setSong] = useState(null);
    const navigate = useNavigate();
    const url = 'http://localhost:5000' // 'http://localhost:5000/message-hub'

    useEffect(() => {
        setSong(GetCurrentSong());
    }, [musicState.songQueue, musicState.currentSongIndex]);
    
    useEffect(() => {
        const setError = (title, message) => {
            setErrorTitle(title);
            setErrorMessage(message);
            setErrorState(true);
        }

        if (isError === false && applicationState.GetCountErrors() > 0) {
            const [title, message] = applicationState.GetErrorFromQueue();
            setError(title, message);
            applicationState.RemoveErrorFromQueue();
        }
    }, [isError, applicationState, applicationState.errorQueue, applicationState.errorQueue.length]);

    /////////////////////////////////////////////////////////////////////////////////

    storageWSContext.useSignalREffect(
        "CreateFolder",
        async ([folder, queueId]) => {
            await connectToFoldersListener();
            await storageState.ReplaceLoadingFolder(folder, queueId);
        }
    );

    storageWSContext.useSignalREffect(
        "RenameFolder",
        (data) => {
            storageState.RenameFolder(data);
        }
    ); 

    storageWSContext.useSignalREffect(
        "DeleteFolder",
        (data) => {storageState.DeleteFolder(data)}
    );

    /////////////////////////////////////////////////////////////////////////////////

    storageWSContext.useSignalREffect(
        "UploadFile",
        ([file, queueId, occupiedSpace, meta]) => {
            file.meta = meta;
            userState.ChangeOccupiedSpace(occupiedSpace);
            storageState.ReplaceLoadingFile(file, queueId);

            if (imageTypes.includes(file.type)) {
                galleryState.ReplaceLoadingPhoto(file, queueId);
            }
        }
    );

    storageWSContext.useSignalREffect(
        "RenameFile",
        (file) => {storageState.RenameFile(file)}
    ); 

    storageWSContext.useSignalREffect(
        "DeleteFile",
        (data) => {
            storageState.DeleteFile(data);
            musicState.DeleteSong(data);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    galleryWSContext.useSignalREffect(
        "AddToAlbum",
        ([file, albumId]) => {
            galleryState.AddToAlbum(file, albumId);
        }
    );

    galleryWSContext.useSignalREffect(
        "Create",
        ([album, queueId]) => {
            galleryState.ReplaceLoadingAlbum(album, queueId);
        }
    );

    galleryWSContext.useSignalREffect(
        "Update",
        ({id, coverAsBytes, name, description}) => {
            galleryState.UpdateAlbum(id, coverAsBytes, name, description);
        }
    );

    galleryWSContext.useSignalREffect(
        "Upload",
        ([file, albumId, queueId]) => {
            storageState.ReplaceLoadingFile(file, queueId);
            galleryState.ReplaceLoadingPhoto(file, queueId, albumId);
        }
    );

    galleryWSContext.useSignalREffect(
        "DeleteAlbum",
        (id) => {
            galleryState.DeleteAlbumById(id);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    galleryWSContext.useSignalREffect(
        "AddComment",
        ({comment, user, albumId, queueId}) => {
            galleryState.ReplaceLoadingComment({comment: comment, user: user}, queueId, albumId);
        }
    );

    galleryWSContext.useSignalREffect(
        "UpdateAlbumViews",
        ({id, views}) => {
            galleryState.UpdateAlbumViews(id, views);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    galleryWSContext.useSignalREffect(
        "AddComment",
        ({comment, user, albumId, queueId}) => {
            galleryState.ReplaceLoadingComment({comment: comment, user: user}, queueId, albumId);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    storageWSContext.useSignalREffect(
        "UpdateOccupiedSpace",
        (space) => {
            userState.ChangeOccupiedSpace(space);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    messageWSContext.useSignalREffect(
        "GetChats",
        (chats) => {
            chatsState.SetChats(chats);
            chatsState.setChatsLoadedState(true);
        }
    );

    messageWSContext.useSignalREffect(
        "ReceiveMessage",
        (data) => {
            const { directModel, messageModel, userPublic } = JSON.parse(data);

            if (directModel && messageModel) {
                chatsState.AddMessage(directModel, messageModel, userPublic);
            }

            if (chatsState.draft && chatsState.draft.id && userPublic.Id === chatsState.draft.id) {
                navigate(`/messages/${userPublic.Id}`);
                chatsState.setDraft(null);
            }
        }
    );

    messageWSContext.useSignalREffect(
        "NewConnection",
        async (id) => {
            await connectToDirectListener(id);
        }
    );

    messageWSContext.useSignalREffect(
        "HandleAccessStateChange",
        (data) => {
            const { id, state } = JSON.parse(data);
            chatsState.UpdateDirectAccessState(id, state);
        }
    );

    messageWSContext.useSignalREffect(
        "DeleteMessage",
        (data) => {
            const { chatId, messageId } = JSON.parse(data);
            chatsState.DeleteMessage(chatId, messageId);
        }
    );

    messageWSContext.useSignalREffect(
        "HandlePinnedStateChanges",
        (data) => {
            const { chatId, messageId, state } = JSON.parse(data);
            chatsState.UpdateMessagePinnedState(chatId, messageId, state);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    
    useEffect(() => {
        connectToFoldersListener();
    }, [storageWSContext.connection]); 
    
    useEffect(() => {
        const connectToGallerySocket = async () => {
            try {
                while (galleryWSContext.connection.state !== 'Connected') {
                    if (galleryWSContext.connection.state === 'Disconnected') {
                        await galleryWSContext.connection.start();
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
    
                await galleryWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
            } catch (error) {
                console.error('Failed to connect or join:', error);
            }
        };
    
        connectToGallerySocket();
    }, [galleryWSContext.connection]);

    return (
        <messageWSContext.Provider url={url + '/message-hub'}>
            <storageWSContext.Provider url={url + '/storage-hub'}>
                <galleryWSContext.Provider url={url + '/gallery-hub'}>
                    <layoutContext.Provider value={{song: song}}>
                        <div className='cloud-wrapper'>
                            {isLoading && <Loader />}
                            <MusicPlayer />
                            <Helmet>
                                <title>Yexider</title>
                            </Helmet>
                            <Information
                                open={isError}
                                close={() => setErrorState(false)}
                                title={errorTitle}
                                message={errorMessage}
                            />
                            {windowWidth > 700 ? <Desktop /> : <Mobile /> }
                        </div>
                    </layoutContext.Provider>
                </galleryWSContext.Provider>
            </storageWSContext.Provider>
        </messageWSContext.Provider>
    );
});

export default Layout;