import React, { createContext, useLayoutEffect } from 'react'
import { useState, useEffect } from 'react';
import { createSignalRContext } from "react-signalr/signalr";
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import Desktop from './Desktop';
import Mobile from './Mobile';
import ApplicationState from '../../../state/application/ApplicationState';
import InformationPopUp from '../shared/popup-windows/information-pop-up/InformationPopUp';
import UserState from '../../../state/entities/UserState';
import MusicPlayer from '../singletones/music-player/MusicPlayer';
import WebsocketListener from '../api/WebsocketListener';
import './css/fonts.css';
import './css/colors.css';
import './css/main.css';
import './css/animations.css';

export const globalWSContext = createSignalRContext();
export const layoutContext = createContext(); 

// export const WaitingForConnection = async (signalRContext, onSuccessCallback = async () => {}) => {
//     while (signalRContext.connection.state === 'Connecting') {
//         applicationState.SetConnectionState(1);
//         await new Promise(resolve => setTimeout(resolve, 2000));
//     }

//     if (signalRContext.connection.state === 'Disconnected') {
//         applicationState.SetConnectionState(2);
        
//         await signalRContext.connection.start();
//         await WaitingForConnection(signalRContext);
//     }

//     if (signalRContext.connection.state === 'Connected') {
//         await onSuccessCallback();
//     }

//     applicationState.SetConnectionState(0);
// }

// export const connectToDirectListener = async (id) => {
//     try {
//         await WaitingForConnection(storageWSContext);

//         if (storageWSContext.connection.state === 'Connected') {
//             await globalWSContext.connection.invoke("ConnectToDirect", id, localStorage.getItem("system_access_token"));
//         }
//     } catch (error) {
//         console.error('Failed to connect or join:', error);
//     }
// };

// export const connectToFoldersListener = async () => {
//     try {
//         await WaitingForConnection(storageWSContext);

//         if (storageWSContext.connection.state === 'Connected') {
//             await storageWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
//         }
//     } catch (error) {
//         console.error('Failed to connect or join:', error);
//     }
// };

// export const connectToGallerySocket = async () => {
//     try {
//         await WaitingForConnection(galleryWSContext);

//         if (galleryWSContext.connection.state === 'Connected') {
//             await galleryWSContext.connection.invoke("Join", localStorage.getItem("system_access_token"));
//         }
//     } catch (error) {
//         console.error('Failed to connect or join:', error);
//     }
// };

const Layout = observer(() => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [isErrorExist, setErrorExistingState] = useState(false);
    const [errorTitle, setErrorTitle] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [song, setSong] = useState(null);

    const navigate = useNavigate();

    globalWSContext.useSignalREffect("CreateFolder", WebsocketListener.CreateFolderListener);
    globalWSContext.useSignalREffect("RenameFolder", WebsocketListener.RenameFolderListener); 
    globalWSContext.useSignalREffect("DeleteFolder", WebsocketListener.DeleteFolderListener);
    globalWSContext.useSignalREffect("UploadFile", WebsocketListener.UploadFileListener);
    globalWSContext.useSignalREffect("RenameFile", WebsocketListener.RenameFileListener); 
    globalWSContext.useSignalREffect("DeleteFile", WebsocketListener.DeleteFileListener);
    globalWSContext.useSignalREffect("UpdateOccupiedSpace", WebsocketListener.UpdateOccupiedSpaceListner);
    globalWSContext.useSignalREffect("AddToAlbum", WebsocketListener.AddToAlbumListner);
    globalWSContext.useSignalREffect("Create", WebsocketListener.CreateAlbumListner);
    globalWSContext.useSignalREffect("Update", WebsocketListener.UpdateAlbumListner);
    globalWSContext.useSignalREffect("Upload", WebsocketListener.UploadFileListener);
    globalWSContext.useSignalREffect("DeleteAlbum", WebsocketListener.DeleteAlbumListner);
    globalWSContext.useSignalREffect("AddComment", WebsocketListener.AddCommentListner);
    globalWSContext.useSignalREffect("DeleteComment", WebsocketListener.DeleteAlbumListner);
    globalWSContext.useSignalREffect("GetChats", WebsocketListener.GetChatsListner);
    globalWSContext.useSignalREffect("ReceiveMessage", WebsocketListener.ReceiveMessageListner);
    globalWSContext.useSignalREffect("NewConnection", WebsocketListener.NewConnectionListner);
    globalWSContext.useSignalREffect("HandleAccessStateChange", WebsocketListener.DirectAccessChangeListner);
    globalWSContext.useSignalREffect("DeleteMessage", WebsocketListener.DeleteMessageListener);
    globalWSContext.useSignalREffect("HandlePinnedStateChanges", WebsocketListener.PinnedStateChangesListener);
    globalWSContext.useSignalREffect("ViewMessage", WebsocketListener.ViewMessageListner);
    globalWSContext.useSignalREffect("DeleteDirectory", WebsocketListener.DeleteDirectoryListner);
    globalWSContext.useSignalREffect("ConnetToGroup", WebsocketListener.ConnectToGroupListner);
    globalWSContext.useSignalREffect("LeaveGroup", WebsocketListener.LeaveGroupListner);

    const authorizeDependencyArray = [UserState.isAuthorize];
    // const songDependencyArray = [MusicState.songQueue, MusicState.currentSongIndex];
    const errorDependencyArray = [isErrorExist, ApplicationState.errorQueue, ApplicationState.errorQueue.length];

    // useEffect(() => {
    //     setSong(GetCurrentSong());
    // }, songDependencyArray);

    useLayoutEffect(() => {
        if (UserState.isAuthorize === false)
            navigate('/main');
    }, authorizeDependencyArray);
    
    useEffect(() => {
        const isErrorNotExist = isErrorExist === false;
        const isApplicationHasErrors = ApplicationState.GetCountErrors() > 0;

        if (isErrorNotExist && isApplicationHasErrors) {
            const [title, message] = ApplicationState.GetErrorFromQueue();

            setErrorTitle(title);
            setErrorMessage(message);
            setErrorExistingState(true);

            ApplicationState.RemoveErrorFromQueue();
        }
    }, errorDependencyArray);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <globalWSContext.Provider url={process.env.REACT_APP_SERVER_URL + '/global-hub-connection'}>
            <layoutContext.Provider value={{song: song}}>
                <div className='cloud-wrapper' style={{'--disconnected-height': ApplicationState.connectionState === 0 ? '0px' : '15px'}}>
                    <title>Instend</title>
                    <MusicPlayer />
                    {ApplicationState.connectionState !== 0 && <Disconnected />}
                    {windowWidth > 700 ? <Desktop /> : <Mobile />}
                    <InformationPopUp
                        open={isErrorExist}
                        close={() => setErrorExistingState(false)}
                        title={errorTitle}
                        message={errorMessage}
                    />
                </div>
            </layoutContext.Provider>
        </globalWSContext.Provider>
    );
});

export default Layout;