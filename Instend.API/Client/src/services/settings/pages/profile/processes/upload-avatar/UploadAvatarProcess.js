import { useEffect, useState } from "react";
import Crop from "../../operations/Crop/Crop";
import UploadAvatar from "../../operations/UploadAvatar/UploadAvatar";

const UploadAvatarProcess = (props) => {
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

        setUploadState(ValidateImage(props.image));
    }, []);

    if (isUpload === true && isCropOperation === true) {
        return (
            <Crop
                isOpen={isCropOperation}
                setOpenState={props.setOpenState}
                setAvatar={props.setAvatar}
                setPrevOperation={setCropOperation}
                aspectRatio={props.aspectRatio}
                Update={props.Update}
                image={props.image}
            />
        );
    };

    return (
            <UploadAvatar 
                isOpen={props.isOpen} 
                setOpenState={props.setOpenState} 
                isUpload={isUpload}
                setNextOperation={setCropOperation}
                Update={props.Update}
                img={props.img}
            />
        );
    }
};

export default UploadAvatarProcess;