import Confirm from "../confirm/Confirm";
import InvalidLink from "../confirm/InvalidLink";
import PasswordCofirm from "./PasswordCofirm";

const RecoveryCode = () => {

    return (
        <Confirm valid={PasswordCofirm} invalid={InvalidLink} />
    );
}

export default RecoveryCode;