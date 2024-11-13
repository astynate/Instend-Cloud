import { instance } from "../../../state/application/Interceptors";

class StorageController {
    static CreateFile = async (name, type, folderId) => {
        let formData = new FormData();        
        let queueId = storageState.CreateLoadingFile(name, folderId);
    
        formData.append("folderId", folderId ? folderId : "");
        formData.append("name", name);
        formData.append("type", type);
        formData.append('queueId', queueId);
    
        await instance.post(`/file`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch(response => {
            applicationState.AddErrorInQueue('Attention!', response.data);
            storageState.DeleteLoadingFile(queueId, folderId);
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
            const queueId = await storageState.CreateLoadingFile(fileName, folderId, type);
    
            files.append('file', file);
            files.append('folderId', folderId ? folderId : "");
            files.append('queueId', queueId);
    
            await instance
                .post('/storage', files, {
                    onUploadProgress: (progressEvent) => {
                        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        storageState.SetLoadingFilePerscentage(queueId, percentCompleted);
                    },
                })
                .catch(error => {
                    applicationState.AddErrorInQueue('Attention!', error.response.data);
                    storageState.DeleteLoadingFile(queueId, file.folderId);
                });
        });
    };

    static GetFilesByType = async () => {
        let files = [];

        await instance
            .get(`api/pagination?from=${count}&count=${20}&type=${type}`)
            .then(response => {

            });

        return files;
    }

    static DownloadFile = async (id) => {
        await instance
            .get(`/file/download?id=${id}`, {
                responseType: "blob"
            })
            .then((response) => {
                DownloadFromResponse(response);
            });
    }

    static UploadFilesFromEvent = async (event, folderId) => {
        event.preventDefault();
        await SendFilesAsync(event.target.files, folderId);
    };

    static UploadFilesFromDragEvent = async (event, folderId) => {
        const files = event.dataTransfer.files;
        await SendFilesAsync(files, folderId);
    }
}

export default StorageController;