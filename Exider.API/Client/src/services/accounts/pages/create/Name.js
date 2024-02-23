import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputText from "../../shared/input/InputText";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";
import { useTranslation } from "react-i18next";

const ValidateNameForm = (name, surname) => {

    return ValidationHandler.ValidateVarchar(name, 31) &&
        ValidationHandler.ValidateVarchar(surname, 31);

}

const Name = () => {

    const user = useContext(UserContext);
    const [name, setName] = useState(user.name);
    const [surname, setSurname] = useState(user.surname);
    const [validationState, setValidationState] = useState(ValidateNameForm(name, surname));
    const { t } = useTranslation();

    useEffect(() => {

        user.name = name;
        user.surname = surname;
        
        setValidationState(ValidateNameForm(name, surname));

    }, [user, name, surname]);

    return (

        <>
            <h1>{t('account.create.creation_of')} <span className="selected-text">Exider ID</span></h1>
            <p className='page-description'>{t('account.create.name_desc')}</p>
            <InputText placeholder={t('account.name')} autofocus={true} defaultValue={name} SetValue={setName} />
            <InputText placeholder={t('account.surname')} defaultValue={surname} SetValue={setSurname} />
            <Link to='/account/create/password' className='next margin-top-40'>
                <Button title={t('account.next')} state={validationState ? 'valid' : 'invalid'} />
            </Link>
        </>

    );

}

export default Name;