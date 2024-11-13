import { instance } from "../../../state/application/Interceptors";
import GlobalContext from "../../../global/GlobalContext";
import ApplicationState from "../../../state/application/ApplicationState";
import StorageState from "../../../state/entities/StorageState";

class CollectionsController {
    static CreateFolder = async (name, folderId) => {
        let form = new FormData();
        let queueId = StorageState.CreateLoadingFolder(name, folderId);
                  
        form.append("name", name);
        form.append("folderId", folderId ? folderId : "");
        form.append("queueId", queueId);
    
        await instance
            .post(`/folders`, form, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })
            .catch((error) => {
                ApplicationState.AddErrorInQueue('Attention!', error.response.data);
                StorageState.DeleteLoadingFolder(queueId, folderId);
            });
    };

    static Delete = async (selectedItems) => {
        if (selectedItems.length < 1) {
            ApplicationState.AddErrorInQueue('Attention!', 'No items selected');
            return false;
        }
    
        for (let i = 0; i < selectedItems.length; i++) {
            const item = selectedItems[i];
            const endpoint = item.strategy === "folder" ? "folders" : "storage";
            const folderId = item.folderId === GlobalContext.guidEmpthy ? item.ownerId : item.folderId;
    
            if (item.strategy === "folder") {
                StorageState.SetFolderAsLoaing(item.id, item.folderId);
            } else {
                StorageState.SetFileAsLoaing(item.id, item.folderId);
            }
          
            await instance
                .delete(`/${endpoint}?id=${item.id}&folderId=${folderId}`)
                .catch((error) => {
                    ApplicationState.AddErrorInQueue('Attention!', error.response.data);
                    
                    if (item.strategy === "folder") {
                        StorageState.RemoveFolderLoadingState(item.id, item.folderId);
                    } else {
                        StorageState.RemoveFileLoadingState(item.id, item.folderId);
                    }
                });
        }

        return true;
    };

    static RenameFolder = async (fileName, item) => {    
        const endpoint = item.strategy === "file" ? "storage" : "folders";
        const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;
    
        StorageState.SetFolderAsLoaing(item.id, item.folderId);
    
        await instance
            .put(`/${endpoint}?id=${item.id}&folderId=${folderId}&name=${fileName}`)
            .catch((error) => {
                ApplicationState.AddErrorInQueueByError('Attention!', error);
                StorageState.RemoveFolderLoadingState(item.id, item.folderId);
            });
    }

    static DownloadCollection = async (id) => {
        instance({
            url: `/folders?id=${id}`,
            method: 'GET',
            responseType: 'blob',
        })
        .then((response) => {
            DownloadFromResponse(response);
        });
    }

    static GetCollectionItems = async () => {
        let items = [];

        await instance
            .get(`/storage?id=${id ? id : ""}`)
            .then(response => {
                if (response.data && response.data.length) {
                    items = response.data;
                }
            })
            .catch((error) => { 
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });

        return items;
    }
}

export default CollectionsController;