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

    SetItems = (id, items, newItems) => {
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
            isHasMore: items.length >= 5
        };
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

    RemoveFileLoadingState(id, folderId) {
        // this.files[AdaptId(folderId)] = this.files[AdaptId(folderId)].map(element => {
        //     if (element.id === id)
        //         element.isLoading = false;

        //     return element;
        // });
    }

    DeleteLoadingFile(queueId, folderId) {
        // if (!this.files || !this.files[AdaptId(folderId)] || !this.files[AdaptId(folderId)].filter)
        //     return false;

        // this.files[AdaptId(folderId)] = this.files[AdaptId(folderId)]
        //     .filter(element => element.queueId !== queueId);
    }

    CreateLoadingFile(name, folderId, type) {
        const file = {
            id: null,
            queueId: this.fileQueueId,
            name: name,
            isLoading: true,
            perscentage: 0,
            folderId: folderId,
            type: type
        }

        // runInAction(() => {
        //     const isFolderExist = this.files[AdaptId(folderId)];

        //     if (isFolderExist === true) {
        //         this.files[AdaptId(folderId)] = [file, ...this.files[AdaptId(folderId)]];
        //     } else {
        //         this.files[AdaptId(folderId)] = [file];
        //     }
            
        //     this.fileQueueId++;
        // });

        return file.queueId;
    }

    SetLoadingFilePerscentage(queueId, perscentage) {
        // const object = Object.values(this.files).flat()
        //     .find(element => element.queueId == queueId);

        // if (object && object.perscentage !== null && object.perscentage !== undefined)
        //     object.perscentage = perscentage;
    }

    SetFileBytes(id, bytes) {
        // const object = Object.values(this.files).flat()
        //     .find(element => element.id == id);

        // if (object && object.fileAsBytes !== null && object.fileAsBytes !== undefined)
        //     object.fileAsBytes = bytes;
    }

    ReplaceLoadingFile(file, queueId) {
        // if (file && file.folderId) {
        //     file.strategy = 'file';

        //     runInAction(() => {
        //         if (this.IsFolderExisitInFiles(file)) {
        //             const index = this.files[AdaptId(file.folderId)]
        //                 .findIndex(element => element.queueId === queueId);

        //             if (index === -1) {
        //                 this.files[AdaptId(file.folderId)] = [file, ...this.files[AdaptId(file.folderId)]]               
        //             } else {
        //                 this.files[AdaptId(file.folderId)][index] = file;
        //             }
        //         }
        //     });
        // }
    }
    
    DeleteFile = (data) => {
        for (let key in this.files) {
            runInAction(() => {
                this.files[key].items = this.files[key].items
                    .filter(element => element.id !== data);
            });
        }
    }

    SetFolderItemsById = (id, itemsAsLists) => {
        // id = AdaptId(id);

        // runInAction(() => {
        //     this.folders[id] = itemsAsLists[0] ? itemsAsLists[0]
        //         .map(folder => { 
        //             return {...folder, strategy: 'folder'} 
        //         }) : [];

        //     this.files[id] = itemsAsLists[1] ? itemsAsLists[1]
        //         .map(file => {
        //             if (file.file !== undefined && file.meta !== undefined)
        //                 return {...file.file, ...file.meta, strategy: 'file'}

        //             return null;
        //         })
        //         .filter(e => e) : [];

        //     this.path[id] = itemsAsLists[2] ? 
        //         itemsAsLists[2] : [];
        // });
    }

    SetAdditionalFiles = (files) => {
        // if (files.length <= 0)
        //     return false;

        // for (let i = 0; i < files.length; i++) {
        //     let file = response.data[i];
            
        //     if (file.file !== undefined && file.meta !== undefined)
        //         file = {...file.file, ...file.meta, strategy: 'file'}

        //     if (!file.id || !file.folderId)
        //         continue;

        //     if (!this.files[file.folderId] || !this.files[file.folderId].filter) {
        //         this.files[file.folderId] = [file];
        //         continue;
        //     }
                
        //     this.files[file.folderId] = this.files[file.folderId]
        //         .filter(element => element.id !== file.id);

        //     this.files[file.folderId] = [file, ...this.files[file.folderId]];
        // }
    };

    GetSelectionByType = (type) => Object.values(this.files).flat()
        .filter(element => element.type ? type.includes(element.type) === true : null); 
}

export default new StorageState();