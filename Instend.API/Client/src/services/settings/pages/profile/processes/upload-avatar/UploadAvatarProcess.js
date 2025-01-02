import { useEffect, useState } from "react";
import Crop from "../../operations/Crop/Crop";
import UploadAvatar from "../../operations/UploadAvatar/UploadAvatar";

const UploadAvatarProcess = ({avatar, isOpen, setOpenState, setAvatarSubmittedState, setAvatar, aspectRatio}) => {
    const [isUpload, setUploadState] = useState(false);
    const [isCropOperation, setCropOperation] = useState(false);

    useEffect(() => {
        const ValidateImage = (image) => {
            const types = ['image/png', 'image/jpg', 'image/jpeg'];
            const isImageHasType = image && image.type;
            const isImageTypeCorrect = isImageHasType && types.includes(image.type);
            const isImageHasValidSize = isImageTypeCorrect && image.size > 0;

            return isImageHasValidSize;
        };

        const isValidImage = ValidateImage(avatar);

        setUploadState(isValidImage);
        setCropOperation(isValidImage);
    }, [avatar]);

    if (isUpload === true && isCropOperation === true) {
        return (
            <Crop
                isOpen={true}
                setOpenState={setOpenState}
                setAvatar={setAvatar}
                setPrevOperation={setCropOperation}
                aspectRatio={aspectRatio}
                image={avatar}
                setAvatarSubmittedState={setAvatarSubmittedState}
            />
        );
    };

    return (
        <UploadAvatar 
            isOpen={isOpen} 
            setOpenState={setOpenState} 
            isUpload={isUpload}
            setNextOperation={setCropOperation}
            setAvatar={setAvatar}
        />
    );
};

export default UploadAvatarProcess;