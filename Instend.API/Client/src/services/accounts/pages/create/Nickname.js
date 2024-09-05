import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputCheck from "../../shared/input-check/InputCheck";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";
import { useTranslation } from "react-i18next";

const Nickname = () => {

    const { t } = useTranslation();
    const user = useContext(UserContext);
    const [nickname, setNickname] = useState(user.nickname);
    const [isValidNickname, setNicknameState] = useState(ValidationHandler
        .ValidateVarchar(nickname, 30));

    useEffect(() => {

        user.nickname = nickname;

    }, [user, nickname]);

    return (

        <>
            <h1>{t('account.create.creation_of')} <span className="selected-text">Yexider ID</span></h1>
            <p className='page-description'>{t('account.create.nickname_desc')}</p>
            <InputCheck
                placeholder={t('account.nickname')}
                autofocus={true}
                defaultValue={user.nickname}
                SetValue={setNickname}
                validationFunction={ValidationHandler.ValidateVarchar}
                setFieldState={setNicknameState}
                statusCode={470}
                endpoint='/accounts/nickname'
            />
            <Link to='/account/create/name' className='next margin-top-40'>
                <Button
                    title={t('account.next')}
                    state={isValidNickname ? 'valid' : 'invalid'}
                />
            </Link>
        </>

    );

}

export default Nickname;