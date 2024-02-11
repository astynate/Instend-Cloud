import React, { useContext } from "react";
import UserContext from "../../processes/Registaration";
import Content from "../../widgets/content/Content";

const Create = () => {

    const user = useContext(UserContext);

    return (

        <Content>
            <h1>{user.name}</h1>
        </Content>

    );

}

export default Create;