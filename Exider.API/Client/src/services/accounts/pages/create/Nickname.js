import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputCheck from "../../shared/input-check/InputCheck";
import Button from "../../shared/button/Button";
import ValidationHandler from "../../../../utils/handlers/ValidationHandler";

const Nickname = () => {

    const user = useContext(UserContext);
    const [nickname, setNickname] = useState(user.nickname);
    const [isValidNickname, setNicknameState] = useState(ValidationHandler
        .ValidateVarchar(nickname, 30));

    useEffect(() => {

        user.nickname = nickname;

    }, [user, nickname]);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p className='page-description'>Please enter your nickname. This is a required field. Your nickname must be unique</p>
            <InputCheck
                placeholder='Nickname'
                autofocus={true}
                defaultValue={user.nickname}
                SetValue={setNickname}
                validationFunction={ValidationHandler.ValidateVarchar}
                setFieldState={setNicknameState}
                endpoint='/accounts/nickname'
            />
            <Link to='/account/create/name' className='next'>
                <Button
                    title="Next"
                    state={isValidNickname ? 'valid' : 'invalid'}
                />
            </Link>
        </>

    );

}

export default Nickname;