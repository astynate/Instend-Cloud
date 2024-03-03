export const UpdateAvatar = async (image, setAvatar) => {

    await setAvatar(prevSettings => ({
        ...prevSettings,
        avatar: image
    }));

}

export const UpdateHeader = async (image, setAvatar) => {

    await setAvatar(prevSettings => ({
        ...prevSettings,
        header: image
    }));

}