import { instance } from "../../../state/application/Interceptors";
import ApplicationState from "../../../state/application/ApplicationState";
import StorageState from "../../../state/entities/StorageState";

class CollectionsController {
    static GetCollectionById = async (id, onSuccess, onError) => {
        await instance
            .get(`/api/collections/${id}`)
            .then(response => {
                if (response && response.data) {
                    onSuccess(response.data);
                }
            })
            .catch(error => {
                onError();
                console.error(error);
            });
    }
    
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
            await instance
                .delete(`/api/collections?id=${selectedItems[i] ?? ''}`)
                .catch(() => {
                    ApplicationState.AddErrorInQueue('Attention!', 'Something went wrong!');
                });
        }

        return true;
    };

    static RenameCollection = async (name, id) => {    
        await instance
            .put(`/api/collections?id=${id}&name=${name}`)
            .catch((error) => {
                ApplicationState.AddErrorInQueueByError('Attention!', error);
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