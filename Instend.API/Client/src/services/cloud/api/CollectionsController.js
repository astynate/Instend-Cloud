import { instance } from "../../../state/application/Interceptors";
import GlobalContext from "../../../global/GlobalContext";
import ApplicationState from "../../../state/application/ApplicationState";
import StorageState from "../../../state/entities/StorageState";

class CollectionsController {
    static CreateCollection = async (name, collectionId) => {
        let form = new FormData();
        let queueId = StorageState.CreateLoadingCollection(name, collectionId);

        if (queueId === undefined) {
            return;
        }
                  
        form.append("name", name);
        form.append("collectionId", collectionId ?? '');
        form.append("queueId", queueId);
    
        await instance
            .post(`api/collections`, form)
            .catch((error) => {
                ApplicationState.AddErrorInQueue('Attention!', error.response.data);
                StorageState.DeleteLoadingFolder(queueId, collectionId);
            });
    };

    static Delete = async (selectedItems) => {
        if (selectedItems.length < 1) {
            ApplicationState.AddErrorInQueue('Attention!', 'No items selected');
            return false;
        }
    
        for (let i = 0; i < selectedItems.length; i++) {
            const item = selectedItems[i];
            const endpoint = item.strategy === "folder" ? "collections" : "storage";
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
        const collectionId = item.folderId === GlobalContext.guidEmpthy ? item.ownerId : item.folderId;
    
        StorageState.SetFolderAsLoaing(item.id, item.folderId);
    
        await instance
            .put(`/api/${endpoint}?id=${item.id}&folderId=${collectionId}&name=${fileName}`)
            .catch((error) => {
                ApplicationState.AddErrorInQueueByError('Attention!', error);
                StorageState.RemoveFolderLoadingState(item.id, item.folderId);
            });
    }

    static DownloadCollection = async (id) => {
        instance({
            url: `/api/collections?id=${id}`,
            method: 'GET',
            responseType: 'blob',
        })
        .then((response) => {
            // DownloadFromResponse(response);
        });
    }

    static GetCollectionsByParentId = async (id, onSuccess = () => {}) => {
        const length = StorageState.collections[id] ? StorageState.collections[id].items.length : 0;

        await instance
            .get(`api/collections?id=${id ?? ''}&skip=${length}&take=${5}`)
            .then(response => {
                if (response.data && response.data.length) {
                    onSuccess(response.data);
                }
            })
            .catch((error) => { 
                ApplicationState.AddErrorInQueueByError('Attention!', error);
            });
    }
}

export default CollectionsController;