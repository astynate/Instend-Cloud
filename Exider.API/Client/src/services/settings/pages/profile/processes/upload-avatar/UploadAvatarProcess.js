import { useEffect, useState, useContext } from "react";
import Crop from "../../operations/Crop/Crop";
import UploadAvatar from "../../operations/UploadAvatar/UploadAvatar";
import { ProfileSettingsContext } from '../../Profile';

export const types = ['image/png', 'image/jpg', 'image/jpeg'];

const ValidateImage = (image) => {

    try {
        return image !== null && types.includes(image.type) && image.size > 0;
    } catch {
        return false;
    }

};

const UploadAvatarProcess = (props) => {

    const [isUpload, setUploadState] = useState(false);
    const [isCropOperation, setCropOperation] = useState(false);
    const [context, setContext] = useContext(ProfileSettingsContext);

    useEffect(() => {

        setUploadState(ValidateImage(context.avatar));

    }, [context]);

    if (isUpload === true && isCropOperation === true) {

        return (

            <>
                <Crop
                    isOpen={isCropOperation}
                    setOpenState={props.setOpenState}
                    setAvatar={props.setAvatar}
                    setPrevOperation={setCropOperation}
                />
            </>
    
        );

    } else {
    
        return (

            <UploadAvatar 
                isOpen={props.isOpen} 
                setOpenState={props.setOpenState} 
                isUpload={isUpload}
                setNextOperation={setCropOperation}
            />
    
        );

    }

};

export default UploadAvatarProcess;