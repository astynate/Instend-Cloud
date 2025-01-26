import { makeAutoObservable, runInAction } from "mobx";
import GlobalContext from "../../global/GlobalContext";

export const AdaptId = (id) => {
    return (id === '' || id == null) ? GlobalContext.guidEmpthy : id;
}

class StorageState {
    path = [];
    files = {};
    collections = {};
    publications = {};
    messages = {};
    collectionQueueId = 0;
    fileQueueId = 0;
    hasMoreSongs = true;
    hasMorePhotos = true;
    countPhotos = 0;
    countSongs = 0;

    constructor() {
        makeAutoObservable(this);
    }

    SetCollectionsAsDefaultValue = () => {
        this.collections = {};
    }

    IsItemsHasMore = (id, items) => {
        return items[AdaptId(id)] ? items[AdaptId(id)].isHasMore : true;
    }

    RenameCollection = (collection) => this.RenameItem(this.collections, collection);   
    RenameFile = (file) => this.RenameItem(this.files, file);
    FindFileById = (id) => Object.values(this.files).flat().find(element => element.id === id);
    FindCollectionById = (id) => Object.values(this.collections).flat().find(element => element.id === id);
    SetPath = (path) => this.path = path;

    SetItems = (id, items, newItems, setIsHasMore = true) => {
        const adaptId = AdaptId(id);
        const existingItems = items[adaptId] ? items[adaptId].items : [];
        const combinedItems = new Set(existingItems.map(item => item.id));
        const uniqueNewItems = [];
    
        newItems.forEach(newItem => {
            if (!combinedItems.has(newItem.id)) {
                combinedItems.add(newItem.id);
                uniqueNewItems.push(newItem);
            }
        });
    
        items[adaptId] = {
            items: [...existingItems, ...uniqueNewItems],
            isHasMore: setIsHasMore ? newItems.length >= 5 : false
        };
    };
    
    OnGetFilesByTypeSuccess = (files) => {
        for (let file of files) {
            if (!!file === true) {
                this.SetItems(files.collectionId, this.files, [file], false);   
            }
        }
    };

    CreateLoadingCollection = (name, collectionId) => {
        if (!!name === false) {
            return undefined;
        }

        const collection = {
            id: GlobalContext.NewGuid(),
            queueId: this.collectionQueueId,
            name: name,
            isLoading: true,
            strategy: 'loading-collection',
            collectionId: AdaptId(collectionId)
        }

        runInAction(() => {
            this.SetItems(collectionId, this.collections, [collection]);
            this.collectionQueueId++;
        });

        return collection.queueId;
    }

    ReplaceLoadingCollection = (collection, queueId) => {
        if (!collection || !this.collections[AdaptId(collection.collectionId)]) {
            return;
        }

        runInAction(() => {
            const id = AdaptId(collection.collectionId);

            this.collections[id].items = this.collections[id].items.filter(element => element.queueId !== queueId);
            this.SetItems(collection.collectionId, this.collections, [collection]);
        });
    }

    RenameItem = (items, data) => {
        for (let key in items) {
            const index = items[key].items
                .findIndex(element => element.id === data[0]);

            if (index !== -1) {
                runInAction(() => {
                    items[key].items[index].name = data[1];
                });
            }
        };
    }

    RemoveCollection = (id) => {
        if (this.collections[id])
            delete this.collections[id];

        for (let key in this.collections) {
            runInAction(() => {
                this.collections[key].items = this.collections[key].items
                    .filter(element => element.id !== id);
            });
        }
    }

    CreateLoadingFile(name, collectionId, type) {
        const file = {
            id: GlobalContext.NewGuid(),
            queueId: this.fileQueueId,
            name: name,
            isLoading: true,
            perscentage: 0,
            folderId: collectionId,
            type: type
        };

        runInAction(() => {
            this.SetItems(collectionId, this.files, [file]);
            this.fileQueueId++;
        });

        return file.queueId;
    }

    SetLoadingFilePerscentage(queueId, perscentage) {
        const object = Object
            .values(this.files)
            .flat()
            .find(element => element.queueId == queueId);

        if (object && object.perscentage !== null && object.perscentage !== undefined)
            object.perscentage = perscentage;
    }

    ReplaceLoadingFile(file, queueId) {
        console.log(this.files, queueId);
        this.DeleteFile(queueId);

        runInAction(() => {
            this.SetItems(file.collectionId, this.files, [file]);
        });
    }
    
    DeleteFile = (data) => {
        for (let key in this.files) {
            runInAction(() => {
                this.files[key].items = this.files[key].items
                    .filter(element => element.id !== data && element.queueId !== data);
            });
        }
    }

    GetSelectionByType = (types) => {
        const result = Object.values(this.files)
            .flat()
            .map(o => o.items)
            .flat()
            .filter(element => element.type ? types.includes(element.type) === true : null);

        return result;
    }
}

export default new StorageState();