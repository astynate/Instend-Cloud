class StorageController {
    static storagePath = `${process.env.REACT_APP_SERVER_URL}/api/storage`;

    static getFullFileURL = (path) => {
        return `${StorageController.storagePath}/full?path=${path}`;
    };

    static getSegmentOfFile = (path) => {
        return `${StorageController.storagePath}/stream?path=${path}`;
    };
};

export default StorageController;