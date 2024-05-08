import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import storageState from "../../../../../states/storage-state";
import { GuidEmpthy } from "../../../../../states/storage-state";

//////////////////////////////////////////////////////////////////////////////////

export const CreateFolder = async (name, folderId) => {
    let formData = new FormData();
    const queueId = storageState.CreateLoadingFolder(name, folderId);
              
    formData.append("name", name);
    formData.append("folderId", folderId ? folderId : "");
    formData.append("queueId", queueId);

    try {
        await instance.post(`/folders`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).catch((error) => {
            applicationState.AddErrorInQueue('Attention!', error.response.data);
            storageState.DeleteLoadingFolder(queueId, folderId);
        });
    } catch {}
};

//////////////////////////////////////////////////////////////////////////////////

export const Delete = async (selectedItems) => {
    if (selectedItems.length < 1) {
        applicationState.AddErrorInQueue('Attention!', 'No files selected');
        return;
    }

    for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const endpoint = item.strategy === "folder" ? "folders" : "storage";
        const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;

        if (item.strategy === "folder") {
            storageState.SetFolderAsLoaing(item.id, item.folderId);
        } else {
            storageState.SetFileAsLoaing(item.id, item.folderId);
        }
      
        await instance
            .delete(`/${endpoint}?id=${item.id}&folderId=${folderId}`)
            .catch((error) => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
                
                if (item.strategy === "folder") {
                    storageState.RemoveFolderLoadingState(item.id, item.folderId);
                } else {
                    storageState.RemoveFileLoadingState(item.id, item.folderId);
                }
            });
    }
};

//////////////////////////////////////////////////////////////////////////////////

export const RenameFolder = async (fileName, item) => {    
    const endpoint = item.strategy === "file" ? "storage" : "folders";
    const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;

    storageState.SetFolderAsLoaing(item.id, item.folderId);

    await instance
        .put(`/${endpoint}?id=${item.id}&folderId=${folderId}&name=${fileName}`)
        .catch((error) => {
            applicationState.AddErrorInQueue('Attention!', error.response.data);
            storageState.RemoveFolderLoadingState(item.id, item.folderId);
        });
}

//////////////////////////////////////////////////////////////////////////////////