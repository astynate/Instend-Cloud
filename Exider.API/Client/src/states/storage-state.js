import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";

export const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const AdaptId = (id) => {
    return (id === '' || id == null) ? GuidEmpthy : id;
}

class StorageState {

    ///////////////////////////////////////////////////////////////////////////////////////////

    files = {};
    folders = {};
    path = [];
    folderQueueId = 0;
    fileQueueId = 0;

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

    CreateLoadingFile(name, folderId) {
        const file = {
            id: null,
            queueId: this.fileQueueId,
            name: name,
            isLoading: true,
            strategy: 'loadingFile',
            folderId: folderId
        }

        runInAction(() => {
            this.files[AdaptId(folderId)] = [file, ...this.files[AdaptId(folderId)]];
            this.fileQueueId++;
        });

        return file.queueId;
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
        for (let key in this.folders) {
            runInAction(() => {
                this.files[key] = this.files[key]
                    .filter(element => element.id !== data);
            });
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    async SetFolderItemsById(id, ErrorMessage) {
        id = AdaptId(id);

        if (!this.files || !this.files[id]) {
            try {
                const response = await instance.get(`/storage?id=${id ? id : ""}`)
                    .catch((error) => ErrorMessage('Attention!', error.response.data));

                runInAction(() => {
                    this.folders[id] = response.data[0] ? 
                        response.data[0].map(folder => {folder.strategy = 'folder'; return folder}) : [];

                    this.files[id] = response.data[1] ? 
                        response.data[1].map(file => {file.strategy = 'file'; return file}) : [];

                    this.path[id] = response.data[2] ? 
                        response.data[2] : [];
                });

            } catch (error) {
                ErrorMessage('Attention!', 'Something went wrong 😎');
                console.error('Error fetching file:', error);

                runInAction(() => {
                    this.folders[id] = [];
                    this.files[id] = [];
                });
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////

    SortByNameAsending(id) {
        this.folders[AdaptId(id)] = this.folders[AdaptId(id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
        this.files[AdaptId(id)] = this.files[AdaptId(id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    }
    
    SortByNameDesending(id) {
        this.folders[AdaptId(id)] = this.folders[AdaptId(id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
        this.files[AdaptId(id)] = this.files[AdaptId(id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
    }    

    SortByDateAsending(id) {
        this.folders[AdaptId(id)] = this.folders[AdaptId(id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );      
        this.files[AdaptId(id)] = this.files[AdaptId(id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );
    }    

    SortByDateDesending(id) {
        this.folders[AdaptId(id)] = this.folders[AdaptId(id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );      
        this.files[AdaptId(id)] = this.files[AdaptId(id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );
    }  
    
    /////////////////////////////////////////////////////////////////////////////////////////// 
}

export default new StorageState();