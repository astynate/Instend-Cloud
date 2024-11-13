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
}

export default GlobalContext;