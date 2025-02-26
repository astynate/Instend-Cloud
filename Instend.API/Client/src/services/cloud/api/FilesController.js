import ApplicationState from "../../../state/application/ApplicationState";
import { instance } from "../../../state/application/Interceptors";
import StorageState, { AdaptId } from "../../../state/entities/StorageState";

class FilesController {
    static GetFilesByParentCollectionAndStorageStateId = async (id, onSuccess = () => {}) => {
        const collectionFiles = StorageState.files[AdaptId(id)];
        const length = collectionFiles ? collectionFiles.items.length : 0;

        await instance
            .get(`api/files?id=${id ?? ''}&skip=${length}&take=${5}`)
            .then(response => {
                if (response.data && response.data.length) {
                    onSuccess(response.data);
                };
            })
            .catch((error) => { 
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    };

    static GetFilesByParentCollectionId = async (id, skip = 0, take = 0, onSuccess = () => {}) => {
        await instance
            .get(`api/files?id=${id ?? ''}&skip=${skip}&take=${take}`)
            .then(response => {
                if (response.data && response.data.length) {
                    onSuccess(response.data);
                };
            })
            .catch((error) => { 
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    };

    static RenameFile = async (name, id) => {    
        await instance
            .put(`/api/files?id=${id}&name=${name}`)
            .catch((error) => {
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    };

    static Delete = async (ids) => {
        for (let i = 0; i < ids.length; i++) {
            await instance
                .delete(`/api/files?id=${ids[i]}`)
                .catch((error) => {
                    ApplicationState.AddErrorInQueueByError('Attention!', error);
                });
        }
    };

    static GetLastFilesWithType = async (take, skip, type, onSuccess = () => {}) => {
        await instance
            .get(`/api/pagination?take=${take}&skip=${skip}&type=${type}`)
            .then(response => {
                if (response && response.data) {
                    onSuccess(response.data);
                };
            })
            .catch(error => {
                console.error(error);
            });
    };
};

export default FilesController;