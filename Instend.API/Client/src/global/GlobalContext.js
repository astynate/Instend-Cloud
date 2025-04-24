class GlobalContext {
    static supportedImageTypes = ['png', 'jpg', 'jpeg', 'gif'];
    static supportedVideoTypes = ['mov', 'mp4'];
    static supportedMusicTypes = ['wav', 'mp3', 'm4a'];
    static systemCollections = ["Music", "Photos", "Trash"];
    
    static guidEmpthy = '00000000-0000-0000-0000-000000000000';
    
    static supportedGalleryTypes = [
        ...GlobalContext.supportedImageTypes, 
        ...GlobalContext.supportedVideoTypes
    ];

    static supportedLanguages = [
        { key: 'en-UK', label: 'English' },
        { key: 'by-K', label: 'Беларускi' },
        { key: 'by-L', label: 'Biełaruski' }
    ];

    static NewGuid() {
        return 'xxxxxxxx-xxxx-xxxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            
            return v.toString(16);
        });
    };

    static roles = [
        {name: 'Viewer'},
        {name: 'Editor'},
        {name: 'Owner'},
    ];
};

export default GlobalContext;