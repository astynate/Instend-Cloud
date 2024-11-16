import ImageHelper from "./ImageHelper";

class TypeHelper {
    static CompareCountWithDimention = async (attachments, maxAspectRatio, minAspectRatio, callback = () => {}) => {
        const dimentions = await ImageHelper.GetImageDimentions(attachments);
        
        const itemsWithSpecificDimention = dimentions
            .filter(d => ImageHelper.GetAspectRatio(d) < maxAspectRatio &&
                         ImageHelper.GetAspectRatio(d) > minAspectRatio);

        return callback(itemsWithSpecificDimention.length);
    }

    static IsColumnTemplate = async (attachments) => {
        const isAllImagesHasPortraitOrienation = TypeHelper.CompareCountPortraitImages(
            attachments, 
            (countImages) => countImages === attachments.length
        );

        const isAllNotHorizontal = TypeHelper.CompareCountWithDimention(
            attachments,
            0, 
            1.4,
            (countImages) => countImages === attachments.length,
        );

        return (isAllNotHorizontal && attachments.length === 3) && isAllImagesHasPortraitOrienation;
    }

    static IsVerticalGridTemplate = async (attachments) => 
        TypeHelper.CompareCountPortraitImages(attachments, (countImages) => countImages > 1);

    static IsHorizontalGridTemplate = async (attachments) => 
        TypeHelper.IsVerticalGridTemplate(attachments) === false;

    static CompareCountPortraitImages = async (attachments, callback = () => {}) =>
        TypeHelper.CompareCountWithDimention(attachments, 0, 1, callback);
}

export default TypeHelper;