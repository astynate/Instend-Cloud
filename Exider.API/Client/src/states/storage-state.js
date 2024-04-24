import { instance } from '../state/Interceptors';
import { makeAutoObservable, runInAction, toJS } from "mobx";

export const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const AdaptId = (id) => {
    return (id === '' || id == null) ? GuidEmpthy : id;
}

class StorageState {
    files = {};
    folders = {};
    photos = {};
    path = [];

    constructor() {
        makeAutoObservable(this);
    }

    IsFolderExisitInFolders(folder) {
        return folder && folder.folderId && this.folders[AdaptId(folder.folderId)];
    }

    IsFolderExisitInFiles(folder) {
        return folder && folder.folderId && this.files[AdaptId(folder.folderId)];
    }

    CreateFolder = (folder) => {
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

    DeleteFolder = (folderId, data) => {
        runInAction(() => {
            this.folders[folderId] = this.folders[folderId]
                .filter(element => element.id !== data);
        });
    }
    
    UploadFile = (file) => {
        file.strategy = 'file';

        if (this.IsFolderExisitInFiles(file)) {
            runInAction(() => {
                this.files[file.folderId] = [...this.files[file.folderId], file];
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
    
    DeleteFile = (folderId, data) => {
        runInAction(() => {
            this.files[folderId] = this.files[folderId]
                .filter(element => element.id !== data);
        });
    }

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
}

export default new StorageState();