class ImageHelper {
    static GetImageDimentions = async (images) => {
        const dimentions = images.map(image => {
            return new Promise((resolve, reject) => { 
                const img = new Image(); 
                
                img.onload = () => { 
                    resolve({ width: img.width, height: img.height }); 
                }; 

                img.onerror = reject; 
                img.src = image; 
            });
        })

        return Promise.all(dimentions);
    };

    static GetAspectRatio = (dimention) => {
        return dimention.width / dimention.height;
    };

    static SortAttachments = async (attachments, callback = () => {}) => { 
        const attachmentsWithAspectRatios = await Promise.all(attachments.map(async image => { 
            const dimentions = await ImageHelper.GetImageDimentions([image]);
            const aspectRatio = ImageHelper.GetAspectRatio(dimentions[0]); 
            
            return {
                image, 
                aspectRatio 
            }; 
        }));
        
        const sorted = attachmentsWithAspectRatios
            .sort(callback)
            .map(item => item.image); 
            
        return sorted; 
    };
}

export default ImageHelper;