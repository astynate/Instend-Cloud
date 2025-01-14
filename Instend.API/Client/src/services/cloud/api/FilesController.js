import ApplicationState from "../../../state/application/ApplicationState";
import { instance } from "../../../state/application/Interceptors";
import StorageState from "../../../state/entities/StorageState";

class FilesController {
    static GetFilesByParentCollectionId = async (id, onSuccess = () => {}) => {
        const length = StorageState.files[id] ? StorageState.files[id].items.length : 0;

        await instance
            .get(`api/files?id=${id ?? ''}&skip=${length}&take=${5}`)
            .then(response => {
                if (response.data && response.data.length) {
                    onSuccess(response.data);
                }
            })
            .catch((error) => { 
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    }
};

export default FilesController;