import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputText from "../../shared/input/InputText";
import Button from "../../shared/button/Button";

const Email = () => {

    const user = useContext(UserContext);
    let username = ''; 

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>Please enter your email. This field is required and must look like<br /> example@domain.com</p>
            <InputText placeholder="Email" autofocus={true} value={username} />
            <Link to='/account/create/nickname'>
                <Button title="Next" />
            </Link>
        </>

    );

}

export default Email;