import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../../processes/Registration";
import InputText from "../../shared/input/InputText";
import Button from "../../shared/button/Button";

const Nickname = () => {

    const user = useContext(UserContext);

    console.log(user);

    return (

        <>
            <h1>Creation of <span className="selected-text">Exider ID</span></h1>
            <p>Please enter your nickname. This is a required field. Your nickname<br /> must be unique</p>
            <InputText placeholder="Nickname" autofocus={true} />
            <Link to='/account/create/name'>
                <Button title="Next" />
            </Link>
        </>

    );

}

export default Nickname;