import React, { useEffect } from "react";
import './main.css';

const Error = (props) => {

    useEffect(() => {

        if (props.state === true) {

            setTimeout(() => {

                props.setState(false);

            }, 3000);

        }

    }, [props.state])

    return (
        <div className="account-error-alert">{props.message}</div>
    );

};

export default Error;