import { instance } from "../../../../../state/Interceptors";
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

export const CreateFile = async (name, type, folderId, error) => {
    let formData = new FormData();
              
    formData.append("folderId", folderId ? folderId : "");
    formData.append("name", name);
    formData.append("type", type.type);

    const queueId = storageState.CreateLoadingFile(name, folderId);

    await instance.post(`/file`, formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    }).then(response => {
        storageState.ReplaceLoadingFile(response.data, queueId);
    }).catch(response => {
        error('Attention!', response.data);
    });
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesAsync = async (files, folderId, error) => {
    await Array.from(files).forEach(async (file) => {
      const files = new FormData();

      files.append('file', file);
      files.append('folderId', folderId ? folderId : "");

      const queueId = storageState.CreateLoadingFile(file.name ? file.name : null, folderId);

      await instance
        .post('/storage', files)
        .then((response) => {
            storageState.ReplaceLoadingFile(response.data, queueId);
        })
        .catch(response => {
            error('Attention!', response.data);
        });
    });
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesFromEvent = async (event, folderId) => {
    event.preventDefault();
    await SendFilesAsync(event.target.files, folderId);
};

//////////////////////////////////////////////////////////////////////////////////

export const SendFilesFromDragEvent = async (event) => {
    var files = event.dataTransfer.files;
    await SendFilesAsync(files);
}

//////////////////////////////////////////////////////////////////////////////////