import { useEffect, useState } from "react";
import { PreviewLoader } from "../../../shared/loader/PreviewLoader";
import { toJS } from "mobx";
import { instance } from "../../../../../state/Interceptors";
import Base64Handler from "../../../../../utils/handlers/Base64Handler";
import styles from './main.module.css';
import storageState from "../../../../../states/storage-state";
import { observer } from "mobx-react-lite";

export const PreviewImage = observer(({file, endpoint, additionalParams = {}}) => {
    const [isLoading, setLoadingState] = useState(true);
    const [fileAsBytes, setFile] = useState(null);

    useEffect(() => {
        const GetFile = async () => {;
            const fileAsJs = toJS(file);
            setLoadingState(true);

            if (fileAsJs && fileAsJs.strategy !== 'folder') {
                await instance
                    .get(`${endpoint}?id=${fileAsJs.id}&${Base64Handler.convertObjectToString(additionalParams)}`)
                    .then((response) => {
                        setFile(response.data);
                        setLoadingState(false);
                        storageState.SetFileBytes(file.id, response.data);
                    })
            }
        };

        if (!file.fileAsBytes) {
            GetFile();
        } else {
            setLoadingState(false);
        }
    }, []);

    return (
        (isLoading ? 
            <div className={styles.previewWrapper}>
                <PreviewLoader />
                <div className={styles.previewImage}>
                    <img 
                        className={styles.preview}
                        src={`${Base64Handler.Base64ToUrlFormatPng(file.preview)}`} 
                        draggable='false'
                    />
                </div>
            </div>
        :
            <img 
                className={styles.image}
                src={`${Base64Handler.Base64ToUrlFormatPng(fileAsBytes)}`} 
                draggable='false'
            />
        ) 
    );
})