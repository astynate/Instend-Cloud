import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import Button from "../../shared/button/Button";
import { useTranslation } from "react-i18next";
import InputText from "../../shared/input/InputText";
import { CalculateAge } from "../../../../handlers/DateHandler";

const DateOfBirth = () => {
    const user = useContext(UserContext);
    const [isValidDateOfBirth, setIsValidDateOfBirth] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth);
    const { t } = useTranslation();

    useEffect(() => {
        setIsValidDateOfBirth(CalculateAge(dateOfBirth) > 5);
        user.dateOfBirth = dateOfBirth;
    }, [user, dateOfBirth]);

    return (
        <>
            <h1>{t('account.create.creation_of')} <span className="selected-text">Instend ID</span></h1>
            <p className='page-description'>{t('account.create.dateofbirth_desc')}</p>
            <InputText
                type="date"
                placeholder={t('account.dateofbirth')} 
                autofocus={true} 
                defaultValue={dateOfBirth} 
                SetValue={setDateOfBirth} 
            />
            <Link to='/account/create/password' className='next margin-top-40'>
                <Button title={t('account.next')} state={isValidDateOfBirth ? 'valid' : 'invalid'} />
            </Link>
        </>
    );
};

export default DateOfBirth;