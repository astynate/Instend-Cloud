import GlobalContext from "../../../../../global/GlobalContext";
import Base64Handler from "../../../../../utils/handlers/Base64Handler";
import ImageHelper from "./ImageHelper";

class TypeHelper {
    static CompareCountWithDimention = async (attachments, minAspectRatio, maxAspectRatio, callback = () => {}) => {
        const images = attachments
            .filter(x => GlobalContext.supportedImageTypes.includes(x.type))
            .map(x => Base64Handler.Base64ToUrlFormatPng(x.preview));
        
        const dimentions = await ImageHelper.GetImageDimentions(images);
        
        const itemsWithSpecificDimention = dimentions
            .filter(d => ImageHelper.GetAspectRatio(d) < maxAspectRatio &&
                         ImageHelper.GetAspectRatio(d) > minAspectRatio);

        return callback(itemsWithSpecificDimention.length);
    }

    static IsColumnTemplate = async (attachments) => {
        const isAllImagesHasPortraitOrienation = await TypeHelper.CompareCountPortraitImages(
            attachments, 
            (countImages) => countImages === attachments.length
        );

        const isAllNotHorizontal = await TypeHelper.CompareCountWithDimention(
            attachments,
            0, 
            1.3,
            (countImages) => countImages === attachments.length,
        );

        return (isAllNotHorizontal && attachments.length === 3) || isAllImagesHasPortraitOrienation;
    }

    static IsVerticalGridTemplate = async (attachments) => 
        await TypeHelper.CompareCountPortraitImages(attachments, (countImages) => countImages > 1);

    static IsHorizontalGridTemplate = async (attachments) => 
        await TypeHelper.IsVerticalGridTemplate(attachments) === false;

    static CompareCountPortraitImages = async (attachments, callback = () => {}) =>
        await TypeHelper.CompareCountWithDimention(attachments, 0, 1, callback);
}

export default TypeHelper;