import { instance } from "../../../../../state/Interceptors";
import { GuidEmpthy } from "../../../../../states/storage-state";

export const RenameCallback = async (fileName, item, ErrorMessage) => {    
    const endpoint = item.strategy === "file" ? "storage" : "folders";
    const folderId = item.folderId === GuidEmpthy ? item.ownerId : item.folderId;

    await instance.put(`/${endpoint}?id=${item.id}&folderId=${folderId}&name=${fileName}`)
        .catch((error) => ErrorMessage('Attention!', error.response.data));
}