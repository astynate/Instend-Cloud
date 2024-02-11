import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputText from "../../shared/input/InputText";
import Button from "../../shared/button/Button";

const Name = () => {

    const user = useContext(UserContext);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>Please enter your name and surname. This is a required fields.</p>
            <InputText placeholder="Name" autofocus={true} />
            <InputText placeholder="Surname" />
            <Link to='/account/create/password'>
                <Button title="Next" />
            </Link>
        </>

    );

}

export default Name;