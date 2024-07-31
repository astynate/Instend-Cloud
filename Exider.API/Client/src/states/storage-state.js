import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";
import applicationState from './application-state';

export const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const AdaptId = (id) => {
    return (id === '' || id == null) ? GuidEmpthy : id;
}

export const SystemFolders = ["Music", "Photos", "Trash"]

class StorageState {

    ///////////////////////////////////////////////////////////////////////////////////////////

    files = {};
    folders = {};
    path = [];
    folderQueueId = 0;
    fileQueueId = 0;
    hasMoreSongs = true;
    hasMorePhotos = true;
    countPhotos = 0;
    countSongs = 0;

    ///////////////////////////////////////////////////////////////////////////////////////////

    constructor() {
        makeAutoObservable(this);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    IsFolderExisitInFolders(folder) {
        return folder && folder.folderId && this.folders[AdaptId(folder.folderId)];
    }

    IsFolderExisitInFiles(folder) {
        return folder && folder.folderId && this.files[AdaptId(folder.folderId)];
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    FindFileById(id) {
        return Object.values(this.files).flat()
            .find(element => element.id === id);
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    CreateLoadingFolder(name, folderId) {
        const folder = {
            id: null,
            queueId: this.folderQueueId,
            name: name,
            isLoading: true,
            strategy: 'loadingFolder',
            folderId: AdaptId(folderId)
        }

        if (this.IsFolderExisitInFolders(folder)) {
            runInAction(() => {
                this.folders[AdaptId(folderId)] = [folder, ...this.folders[AdaptId(folderId)]];
                this.folderQueueId++;
            });
        }

        return folder.queueId;
    }

    ReplaceLoadingFolder(folder, queueId) {
        if (folder && folder.folderId) {
            folder.strategy = 'folder';

            runInAction(() => {
                const index = this.folders[AdaptId(folder.folderId)]
                    .findIndex(element => element.queueId === queueId);

                if (index === -1) {
                    this.folders[AdaptId(folder.folderId)] = [folder, ...this.folders[AdaptId(folder.folderId)]]               
                } else {
                    this.folders[AdaptId(folder.folderId)][index] = folder;
                }
            });
        }
    }

    SetFolderAsLoaing(id, folderId) {
        this.folders[AdaptId(folderId)] = this.folders[AdaptId(folderId)].map(element => {
            if (element.id === id) {
                element.isLoading = true;
            }

            return element;
        });
    }

    RemoveFolderLoadingState(id, folderId) {
        this.folders[AdaptId(folderId)] = this.folders[AdaptId(folderId)].map(element => {
            if (element.id === id) {
                element.isLoading = false;
            }

            return element;
        });
    }

    DeleteLoadingFolder(queueId, folderId) {
        this.folders = this.folders[AdaptId(folderId)]
            .filter(element => element.queueId !== queueId);
    }

    // ################################################################################### //
    
    RenameFolder = (folder) => {
        for (let key in this.folders) {
            const index = this.folders[key]
                .findIndex(element => element.id === folder[0]);

            if (index !== -1) {
                runInAction(() => {
                    this.folders[key][index].name = folder[1];
                    this.folders[key][index].isLoading = false;
                });
            }
        };
    }    

    DeleteFolder = (id) => {
        if (this.folders[id]) {
            delete this.folders[id];
        }

        for (let key in this.folders) {
            runInAction(() => {
                this.folders[key] = this.folders[key]
                    .filter(element => element.id !== id);
            });
        }
    }

    SetFileAsLoaing(id, folderId) {
        if (this.files && this.files[AdaptId(folderId)]) {
            this.files[AdaptId(folderId)] = this.files[AdaptId(folderId)].map(element => {
                if (element.id === id) {
                    element.isLoading = true;
                }
    
                return element;
            });
        }
    }

    RemoveFileLoadingState(id, folderId) {
        this.files[AdaptId(folderId)] = this.files[AdaptId(folderId)].map(element => {
            if (element.id === id) {
                element.isLoading = false;
            }

            return element;
        });
    }

    DeleteLoadingFile(queueId, folderId) {
        if (this.files && this.files[AdaptId(folderId)] && this.files[AdaptId(folderId)].filter) {
            this.files[AdaptId(folderId)] = this.files[AdaptId(folderId)]
            .filter(element => element.queueId !== queueId);
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    CreateLoadingFile(name, folderId, type) {
        const file = {
            id: null,
            queueId: this.fileQueueId,
            name: name,
            isLoading: true,
            strategy: 'loadingFile',
            perscentage: 0,
            folderId: folderId,
            type: type
        }

        runInAction(() => {
            if (SystemFolders.includes(folderId)) {
                const folder = Object.values(this.folders).flat()
                    .find(element => (element.name && element.typeId) ? element.name === folderId && element.typeId === 'System' : null);

                if (folder && folder.id && this.files[AdaptId(folder.id)]) {
                    this.files[AdaptId(folder.id)] = [file, ...this.files[AdaptId(folder.id)]];
                } else {
                    this.files[AdaptId(folder.id)] = [file];
                }
            } else {
                this.files[AdaptId(folderId)] = [file, ...this.files[AdaptId(folderId)]];
            }
            
            this.fileQueueId++;
        });

        return file.queueId;
    }

    SetLoadingFilePerscentage(queueId, perscentage) {
        const object = Object.values(this.files).flat()
            .find(element => element.queueId == queueId);

        if (object && object.perscentage !== null && object.perscentage !== undefined) {
            object.perscentage = perscentage;
        }
    }

    ReplaceLoadingFile(file, queueId) {
        if (file && file.folderId) {
            file.strategy = 'file';

            runInAction(() => {
                if (this.IsFolderExisitInFiles(file)) {
                    const index = this.files[AdaptId(file.folderId)]
                        .findIndex(element => element.queueId === queueId);

                    if (index === -1) {
                        this.files[AdaptId(file.folderId)] = [file, ...this.files[AdaptId(file.folderId)]]               
                    } else {
                        this.files[AdaptId(file.folderId)][index] = file;
                    }
                }
            });
        }
    }

    // ################################################################################### //

    RenameFile = (file) => {
        for (let key in this.files) {
            const index = this.files[key]
                .findIndex(element => element.id === file.id);

            if (index !== -1) {
                runInAction(() => {
                    this.files[key][index].name = file.name;
                });
            }
        };
    }
    
    DeleteFile = (data) => {
        for (let key in this.files) {
            runInAction(() => {
                this.files[key] = this.files[key]
                    .filter(element => element.id !== data);
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    async SetFolderItemsById(id) {
        id = AdaptId(id);

        if (!this.folders || !this.folders[id]) {
            try {
                const response = await instance.get(`/storage?id=${id ? id : ""}`)
                    .catch((error) => applicationState.AddErrorInQueue('Attention!', error.response.data));

                runInAction(() => {
                    this.folders[id] = response.data[0] ? 
                        response.data[0].map(folder => {folder.strategy = 'folder'; return folder}) : [];

                    this.files[id] = response.data[1] ? 
                        response.data[1].map(file => 
                        {
                            if (file.file !== undefined && file.meta !== undefined) {
                                return {...file.file, ...file.meta, strategy: 'file'}
                            }
                        }) : [];

                    this.path[id] = response.data[2] ? 
                        response.data[2] : [];
                });

            } catch (error) {
                applicationState.AddErrorInQueue('Attention!', 'Something went wrong 😎');
                console.error('Error fetching file:', error);

                runInAction(() => {
                    this.folders[id] = [];
                    this.files[id] = [];
                });
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    async GetItems(hasMore = this.hasMorePhotos, count=this.countPhotos, type='gallery') {
        await instance
            .get(`api/pagination?from=${count}&count=${20}&type=${type}`)
            .then(response => {
                if (response.data && response.data.length && response.data.length < 20) {
                    hasMore = false;
                }

                runInAction(() => {
                    for (let i in response.data) {
                        let file = response.data[i];
                        
                        if (file.file !== undefined && file.meta !== undefined) {
                            file = {...file.file, ...file.meta, strategy: 'file'}
                        }

                        if (file.id && file.folderId) {
                            if (this.files[file.folderId] && this.files[file.folderId].filter) {
                                this.files[file.folderId] = this.files[file.folderId]
                                    .filter(element => element.id !== file.id);

                                this.files[file.folderId] = [file, ...this.files[file.folderId]];
                            } else {
                                this.files[file.folderId] = [file];
                            }
                        }
                    }

                    if (response.data.length) {
                        count += response.data.length;
                    }

                    hasMore = true;
                });
            })
            .catch(error => {
                applicationState.AddErrorInQueue('Attention!', error.response.data);
            });
    };

    //////////////////////////////////////////////////////////////////////////////////////////

    GetSelectionByType(type) {
        return Object.values(this.files).flat()
            .filter(element => element.type ? type.includes(element.type) === true : null); 
    }

    //////////////////////////////////////////////////////////////////////////////////////////
}

export default new StorageState();