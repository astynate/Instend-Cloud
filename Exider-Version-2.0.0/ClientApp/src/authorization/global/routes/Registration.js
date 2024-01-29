import PasswordField from '../../components/fields/password/PasswordField';
import TextField from '../../components/fields/text/TextField';
import SubmitButton from '../../components/fields/button/SubmitButton';
import logo from '../../global/images/logo.svg';
import { useEffect, useState } from 'react';

const Registration = () => {

    const [name, setName] = useState();

    useEffect(() => {

        console.log(name);

    }, [name]);

    return (

        <>

            <img
                src={logo}
                className="logo"
                draggable="false"
            />
            <div className="divided">
                <TextField
                    name="name"
                    placeholder="Name"
                    max="25"
                />
                <TextField
                    name="surname"
                    placeholder="Surname"
                    max="25"
                />
            </div>
            <TextField
                name="nickname"
                placeholder="Nickname"
                value={name}
                onChange={() => {}}
                max="30"
            />
            <TextField
                name="email"
                placeholder="Email"
            />
            <PasswordField />
            <SubmitButton
                value="Register"
                isDisabled={true}
            />

        </>

    );

};

export default Registration;