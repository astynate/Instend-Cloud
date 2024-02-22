import React, { createContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import RecoveryCode from '../pages/password-recovery/RecoveryCode';
import NewPassword from '../pages/password-recovery/NewPassword';
import Back from '../shared/back/Back';
import Line from '../shared/line/Line';

let PasswordRecoveryContext = createContext();

const PasswordRecovery = () => {

    let recoveryObject = {
        password: '',
        code: '',
        isCodeValid: false,
    }

    return (

        <PasswordRecoveryContext.Provider value={recoveryObject}>
            <Routes>
                <Route path=":id" element={<RecoveryCode />} />
                <Route path="/new-value" element={<NewPassword />} />
            </Routes>
        </PasswordRecoveryContext.Provider>

    );

}

export { PasswordRecovery, PasswordRecoveryContext };