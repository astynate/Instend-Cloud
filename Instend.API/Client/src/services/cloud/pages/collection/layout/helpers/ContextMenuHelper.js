class ContextMenuHelper {
    static Properties = (selectedItems, setRightPanelState, setFolderProperties) => {
        if (selectedItems.strategy === "file") {
            setRightPanelState(true);
        } else {
            setFolderProperties(true);
        }
    };
}

export default ContextMenuHelper;