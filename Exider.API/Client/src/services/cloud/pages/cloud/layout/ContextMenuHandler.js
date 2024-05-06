import { instance } from "../../../../../state/Interceptors";

const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const Properties = (selectedItems, setRightPanelState, setFolderProperties) => {
    if (selectedItems.strategy === "file") {
        setRightPanelState(true);
    } else {
        setFolderProperties(true);
    }
};

export const Delete = async (selectedItems, ErrorMessage) => {
    if (selectedItems.length < 1) {
        ErrorMessage('Attention!', 'No file selected');
        return;
    }

    for (let i = 0; i < selectedItems.length; i++) {
        const item = selectedItems[i];
        const endpoint = item.strategy === "folder" ? "folders" : "storage";
        const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;
      
        await instance.delete(`/${endpoint}?id=${item.id}&folderId=${folderId}`)
          .catch((error) => ErrorMessage('Attention!', error.response.data));
    }
};