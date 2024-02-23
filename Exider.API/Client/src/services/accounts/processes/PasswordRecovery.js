import React, { createContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import RecoveryCode from '../pages/password-recovery/RecoveryCode';
import NewPassword from '../pages/password-recovery/NewPassword';
import EnterEmail from '../pages/password-recovery/EnterEmail';

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
                <Route path="/email" element={<EnterEmail />} />
                <Route path=":id" element={<RecoveryCode />} />
                <Route path="/new-value" element={<NewPassword />} />
            </Routes>
        </PasswordRecoveryContext.Provider>

    );

}

export { PasswordRecovery, PasswordRecoveryContext };