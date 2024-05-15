import { instance } from "../../../../../state/Interceptors";
import applicationState from "../../../../../states/application-state";
import storageState from "../../../../../states/storage-state";

//////////////////////////////////////////////////////////////////////////////////

export const types = {
    "folder": {
        title: "Create folder",
        text: "Name is required",
        placeholder: "Folder name",
        type: "folder"
    },
    "txt": {
        title: "Create note",
        text: "Name is required",
        placeholder: "Note name",
        type: "txt"
    },
    "docx": {
        title: "Create Word Document",
        text: "Name is required",
        placeholder: "Document name",
        type: "docx"
    },
    "xlsx": {
        title: "Create Excel Table",
        text: "Name is required",
        placeholder: "Table name",
        type: "xlsx"
    },
    "pptx": {
        title: "Create Powerpoint Presentation",
        text: "Name is required",
        placeholder: "Presentation name",
        type: "pptx"
    },
    "psd": {
        title: "Create Phoshop file",
        text: "Name is required",
        placeholder: "File name",
        type: "psd"
    },
    "ai": {
        title: "Create Illustrator file",
        text: "Name is required",
        placeholder: "File name",
        type: "ai"
    }
}

//////////////////////////////////////////////////////////////////////////////////

export const CreateFile = async (name, type, folderId) => {
    let formData = new FormData();
              
    const queueId = storageState.CreateLoadingFile(name, folderId);

    formData.append("folderId", folderId ? folderId : "");
    formData.append("name", name);
    formData.append("type", type);
    formData.append('queueId', queueId);

    await instance.post(`/file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).catch(response => {
        applicationState.AddErrorInQueue('Attention!', response.data);
        storageState.DeleteLoadingFile(queueId, folderId);
    });
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesAsync = async (files, folderId, error) => {
    await Array.from(files).forEach(async (file) => {
      const files = new FormData();

      const queueId = await storageState.CreateLoadingFile(file.name ? file.name : null, folderId);

      files.append('file', file);
      files.append('folderId', folderId ? folderId : "");
      files.append('queueId', queueId);

      await instance
        .post('/storage', files)
        .catch(error => {
            applicationState.AddErrorInQueue('Attention!', error.response.data);
            storageState.DeleteLoadingFile(queueId, file.folderId);
        });
    });
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesFromEvent = async (event, folderId) => {
    event.preventDefault();
    await SendFilesAsync(event.target.files, folderId);
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesFromDragEvent = async (event, folderId) => {
    var files = event.dataTransfer.files;
    await SendFilesAsync(files, folderId);
}

//////////////////////////////////////////////////////////////////////////////////