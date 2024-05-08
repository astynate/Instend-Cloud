import { instance } from "../../../../../state/Interceptors";

const GuidEmpthy = '00000000-0000-0000-0000-000000000000';

export const Properties = (selectedItems, setRightPanelState, setFolderProperties) => {
    if (selectedItems.strategy === "file") {
        setRightPanelState(true);
    } else {
        setFolderProperties(true);
    }
};