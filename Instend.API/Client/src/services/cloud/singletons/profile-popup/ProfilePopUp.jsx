import { useState } from "react";
import LanguagesPopUp from "./widgets/LanguagesPopUp";
import MainProfilePopUp from "./widgets/MainProfilePopUp";
import ThemePopUp from "./widgets/ThemePopUp";

const ProfilePopUp = () => {
    const [currentWindow, setCurrentWindow] = useState(0);

    const windows = [
        <MainProfilePopUp setCurrentWindow={setCurrentWindow} />, 
        <ThemePopUp close={() => setCurrentWindow(0)} />, 
        <LanguagesPopUp close={() => setCurrentWindow(0)} />
    ];

    return windows[currentWindow];
};

export default ProfilePopUp;