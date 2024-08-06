import { toJS } from "mobx";
import { useEffect } from "react";
import DocViewer from "react-doc-viewer";
import { instance } from "../../../../../state/Interceptors";
import storageState from "../../../../../states/storage-state";

export const PreviewDocument = ({file}) => {
    useEffect(() => {
        const GetFile = async () => {;
            const fileAsJs = toJS(file);

            if (fileAsJs && fileAsJs.strategy !== 'folder') {
                await instance
                    .get(`/file?id=${fileAsJs.id}`)
                    .then((response) => {
                        storageState.SetFileBytes(file.id, response.data);
                    })
                    .catch((error) => {
                    });
            }
        };

        if (!file.fileAsBytes) {
            GetFile();
        }
    }, []);

    return (
        file.fileAsBytes && <DocViewer documents={["http://192.168.1.63:5000/file?id=${fileAsJs.id}"]} />
    )
}