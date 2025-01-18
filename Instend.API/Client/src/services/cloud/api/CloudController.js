import { instance } from "../../../state/application/Interceptors";
import ApplicationState from "../../../state/application/ApplicationState";
import StorageState from "../../../state/entities/StorageState";
import ResponseHandler from "../../../utils/handlers/ResponseHandler";

class CloudController {
    static CreateFile = async (name, type, folderId) => {
        let formData = new FormData();        
        let queueId = StorageState.CreateLoadingFile(name, folderId);
    
        formData.append("folderId", folderId ? folderId : "");
        formData.append("name", name);
        formData.append("type", type);
        formData.append('queueId', queueId);

        const headers = {
            'Content-Type': 'multipart/form-data'
        };

        const data = {
            headers: headers
        };
    
        await instance
            .post(`api/files`, formData, data)
            .catch(response => {
                ApplicationState.AddErrorInQueue('Attention!', response.data);
                StorageState.DeleteLoadingFile(queueId, folderId);
            });
    };

    static UploadFilesAsync = async (files, folderId) => {
        await Array.from(files).forEach(async (file) => {
            let type = null;
    
            if (file.type) {
                type = file.type.split('/');
    
                if (type.length === 2) {
                    type = type[1];
                } else{
                    type = null;
                }
            }
    
            const files = new FormData();
            const fileName = file.name ? file.name : null;
            const queueId = await StorageState.CreateLoadingFile(fileName, folderId, type);
    
            files.append('file', file);
            files.append('collectionId', folderId ? folderId : "");
            files.append('queueId', queueId);
    
            await instance
                .post('/api/files', files, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        StorageState.SetLoadingFilePerscentage(queueId, percentCompleted);
                    },
                })
                .catch(error => {
                    ApplicationState.AddErrorInQueue('Attention!', error.response.data);
                    StorageState.DeleteLoadingFile(queueId, file.folderId);
                });
        });
    };

    static GetFilesByType = async (from, type) => {
        let files = [];

        await instance
            .get(`api/pagination?from=${from}&count=${20}&type=${type}`)
            .then(response => {

            });

        return files;
    }

    static DownloadFile = async (id) => {
        await instance
            .get(`api/files/download?id=${id}`, {responseType: "blob"})
            .then((response) => {
                ResponseHandler.DownloadFromResponse(response);
            });
    }

    static UploadFilesFromEvent = async (event, folderId) => {
        event.preventDefault();
        await CloudController.UploadFilesAsync(event.target.files, folderId);
    };

    static UploadFilesFromDragEvent = async (event, folderId) => {
        const files = event.dataTransfer.files;
        await CloudController.UploadFilesAsync(files, folderId);
    }

    static GetPath = async (id, onSuccess = () => {}) => {
        await instance
            .get(`api/cloud?id=${id ?? ''}`)
            .then((response) => {
                if (response && response.data) {
                    onSuccess(response.data);
                }
            }); 
    }
}

export default CloudController;