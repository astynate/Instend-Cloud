import { instance } from "../../../../../state/Interceptors";

const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const Properties = (selectedItems, setRightPanelState, setFolderProperties) => {
    if (selectedItems[0].strategy === "file") {
        setRightPanelState(true);
    } else {
        setFolderProperties(true);
    }
};

export const Share = () => {
    alert("!");
};

export const Delete = async (selectedItems, ErrorMessage) => {
    const item = selectedItems[0];
    const endpoint = item.strategy === "file" ? "storage" : "folders";
    const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;
  
    await instance.delete(`/${endpoint}?id=${item.id}&folderId=${folderId}`)
      .catch((error) => ErrorMessage('Attention!', error.response.data));
};