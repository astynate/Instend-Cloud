import PasswordField from '../../components/fields/password/PasswordField';
import TextField from '../../components/fields/text/TextField';
import SubmitButton from '../../components/fields/button/SubmitButton';
import ValidationService from '../../services/ValidationService';
import logo from '../../global/images/logo.svg';
import { useEffect, useState } from 'react';
import AlertService from '../../services/AlertService';
import RegistrationService from '../../services/RegistrationService';

const Registration = () => {

    let [name, setName] = useState('');
    let [surname, setSurname] = useState('');
    let [nickname, setNickname] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [isValid, setValid] = useState([false, 'Something went wrong']);
    let [isCheckingValid, setCheckingValid] = useState(false);

    let validationParameters = [

        ValidationService.ValidateTextField(name),
        ValidationService.ValidateTextField(surname),
        ValidationService.ValidateTextField(nickname),
        ValidationService.ValidateEmail(email),
        ValidationService.ValidatePassword(password)

    ];

    const ShowErrorMessage = (message) => {

        if (message) {

            setValid([false, message]);

        } 

        setCheckingValid(true);
        setTimeout(() => setCheckingValid(false), 3500);

    };

    useEffect(() => {

        isValid = [true, null];

        try {

            validationParameters.forEach((value) => {

                if (value[0] === false) {

                    isValid = [false, value[1]];

                    throw new Error();

                }

            });

        } catch { }

        setValid(isValid);

    }, [name, surname, nickname, email, password]);

    return (

        <>
            {isCheckingValid ? <AlertService message={isValid[1]} /> : null}
            <img
                src={logo}
                className="logo"
                draggable="false"
            />
            <div className="divided">
                <TextField
                    name="name"
                    placeholder="Name"
                    value={name}
                    onChange={(event) => { setName(event.target.value); }}
                    max="25"
                />
                <TextField
                    name="surname"
                    placeholder="Surname"
                    value={surname}
                    onChange={(event) => { setSurname(event.target.value) }}
                    max="25"
                />
            </div>
            <TextField
                name="nickname"
                value={nickname}
                onChange={(event) => { setNickname(event.target.value) }}
                placeholder="Nickname"
                max="30"
            />
            <TextField
                name="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value) }}
                placeholder="Email"
            />
            <PasswordField
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
            />
            <SubmitButton
                value="Register"
                isDisabled={!isValid[0]}
                onClick={ async (event) => {

                    event.preventDefault();

                    if (isValid[0] === false && isCheckingValid === false) {

                        ShowErrorMessage(null);

                    }

                    if (isValid[0] === true) {

                        const user = {

                            name: name,
                            surname: surname,
                            nickname: nickname,
                            email: email,
                            password: password

                        };

                        if (!await RegistrationService.RegisterAsync(user)) {

                            ShowErrorMessage("Something went wrong");

                        }

                    }

                }}
            />

        </>

    );

};

export default Registration;