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
            folderId: folderId
        }

        runInAction(() => {
            this.folders[folderId] = [folder, ...toJS(this.folders[folderId])];
            this.folderQueueId++;
        });
    }

    ReplaceLoadingFolder(folder, queueId) {
        if (folder && folder.folderId) {
            runInAction(() => {
                this.folders[folder.folderId] = this.files[folder.folderId].map(element => {
                    if (element.queueId && element.queueId === queueId) {
                        element = folder;
                    }

                    return element;
                })
            })
        }
    }

    // ################################################################################### //

    CreateFolder(folder) {
        folder.strategy = 'folder';

        if (this.IsFolderExisitInFolders(folder)) {
            runInAction(() => {
                this.folders[folder.folderId] = [folder, ...toJS(this.folders[folder.folderId])];
            });
        }
    }
    
    RenameFolder = (folder) => {
        for (let key in this.folders) {
            const index = this.folders[key]
                .findIndex(element => element.id === folder[0]);

            if (index !== -1) {
                runInAction(() => {
                    this.folders[key][index].name = folder[1];
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
            this.files[folderId] = [file, ...this.files[folderId]];
            this.fileQueueId++;
        });
    }

    ReplaceLoadingFile(file, queueId) {
        if (file && file.folderId) {
            runInAction(() => {
                this.files[file.folderId] = this.files[file.folderId].map(element => {
                    if (element.queueId && element.queueId === queueId) {
                        element = file;
                    }

                    return element;
                })
            })
        }
    }

    // ################################################################################### //
    
    UploadFile(file) {
        file.strategy = 'file';

        if (this.IsFolderExisitInFiles(file)) {
            runInAction(() => {
                this.files[file.folderId] = [file, ...this.files[file.folderId]];
            });
        }
    }

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

    SortByNameAsending() {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            a.name.localeCompare(b.name)
        );
    }
    
    SortByNameDesending() {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            b.name.localeCompare(a.name)
        );
    }    

    SortByDateAsending() {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );      
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            new Date(b.creationTime).getTime() - new Date(a.creationTime).getTime()
        );
    }    

    SortByDateDesending() {
        storageState.folders[AdaptId(params.id)] = storageState.folders[AdaptId(params.id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );      
        storageState.files[AdaptId(params.id)] = storageState.files[AdaptId(params.id)].sort((a, b) => 
            new Date(a.creationTime).getTime() - new Date(b.creationTime).getTime()
        );
    }  
    
    /////////////////////////////////////////////////////////////////////////////////////////// 
}

export default new StorageState();