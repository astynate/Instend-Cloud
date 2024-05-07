import { instance } from "../../../../../state/Interceptors";
import storageState from "../../../../../states/storage-state";

//////////////////////////////////////////////////////////////////////////////////

export const CreateFolder = async (name, folderId, error) => {
    let formData = new FormData();
    const queueId = storageState.CreateLoadingFolder(name, folderId);
              
    formData.append("name", name);
    formData.append("folderId", folderId ? folderId : "");
    formData.append("queueId", queueId);

    instance.post(`/folders`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch(response => {
        error('Attention!', response.data);
    });
};

//////////////////////////////////////////////////////////////////////////////////