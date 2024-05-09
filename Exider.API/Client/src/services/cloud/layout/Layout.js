import React, { createContext, useCallback } from 'react'
import { useState, useEffect } from 'react';
import Loader from '../widgets/loader/Loader';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import { Helmet } from 'react-helmet';
import Desktop from './Desktop';
import Mobile from './Mobile';
import { createSignalRContext } from "react-signalr/signalr";
import { observer } from 'mobx-react-lite';
import storageState from '../../../states/storage-state';
import galleryState from '../../../states/gallery-state';
import Information from '../shared/information/Information';
import applicationState from '../../../states/application-state';

export const messageWSContext = createSignalRContext();
export const storageWSContext = createSignalRContext();
export const galleryWSContext = createSignalRContext();
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

const Layout = observer(() => {
    const handleLoading = () => setIsLoading(false);
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    
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
        ([file, queueId]) => {
            storageState.ReplaceLoadingFile(file, queueId);

            if (imageTypes.includes(file.type)) {
                galleryState.ReplaceLoadingPhoto(file, queueId);
            }
        }
    );

    storageWSContext.useSignalREffect(
        "AddToAlbum",
        ([file, albumId]) => {
            galleryState.AddToAlbum(file, albumId);
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
            galleryState.DeletePhoto(data);
        }
    );

    /////////////////////////////////////////////////////////////////////////////////

    galleryWSContext.useSignalREffect(
        "Create",
        ([album, queueId]) => {
            galleryState.ReplaceLoadingAlbum(album, queueId);
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
        <messageWSContext.Provider url={"http://localhost:5000/message-hub"}>
            <storageWSContext.Provider url={"http://localhost:5000/storage-hub"}>
                <galleryWSContext.Provider url={"http://localhost:5000/gallery-hub"}>
                    <div className='cloud-wrapper'>
                        {isLoading && <Loader />}
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
                </galleryWSContext.Provider>
            </storageWSContext.Provider>
        </messageWSContext.Provider>
    );
});

export default Layout;