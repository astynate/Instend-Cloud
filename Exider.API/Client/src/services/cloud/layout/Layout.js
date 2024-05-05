import React, { createContext } from 'react'
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

export const messageWSContext = createSignalRContext();
export const storageWSContext = createSignalRContext();
export const LayoutContext = createContext();
export const imageTypes = ['png', 'jpg', 'jpeg', 'gif'];

const Layout = observer(() => {
    const handleLoading = () => setIsLoading(false);
    const [isLoading, setIsLoading] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isError, setErrorState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const ErrorMessage = (title, message) => {
        setErrorTitle(title);
        setErrorMessage(message);
        setErrorState(true);
    }

    storageWSContext.useSignalREffect(
        "CreateFolder",
        (folder) => {storageState.CreateFolder(folder)}
    );

    storageWSContext.useSignalREffect(
        "RenameFolder",
        (data) => {storageState.RenameFolder(data)}
    ); 

    storageWSContext.useSignalREffect(
        "DeleteFolder",
        (data) => {storageState.DeleteFolder(data)}
    );

    storageWSContext.useSignalREffect(
        "UploadFile",
        (file) => {
            storageState.UploadFile(file);

            if (imageTypes.includes(file.type)) {
                galleryState.AddPhoto(file);
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
            galleryState.DeletePhoto(data);
        }
    );

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
        const connectToWebSocket = async () => {
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
    
        connectToWebSocket();
    }, [storageWSContext.connection]);      

    return (
        <messageWSContext.Provider url={"http://localhost:5000/message-hub"}>
            <storageWSContext.Provider url={"http://localhost:5000/storage-hub"}>
                <LayoutContext.Provider value={{Error: ErrorMessage}}>
                    <div className='cloud-wrapper'>
                        {isLoading && <Loader />}
                        <Helmet>
                            <title>Yexider Cloud</title>
                        </Helmet>
                        <Information
                            open={isError}
                            close={() => setErrorState(false)}
                            title={errorTitle}
                            message={errorMessage}
                        />
                        {windowWidth > 700 ? <Desktop /> : <Mobile /> }
                    </div>
                </LayoutContext.Provider>
            </storageWSContext.Provider>
        </messageWSContext.Provider>
    );
});

export default Layout;