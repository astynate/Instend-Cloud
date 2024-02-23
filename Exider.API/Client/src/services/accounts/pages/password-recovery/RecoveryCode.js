import Confirm from "../confirm/Confirm";
import InvalidLink from "../confirm/InvalidLink";
import ValidLink from "../confirm/ValidLink";

const RecoveryCode = () => {

    return (
        <Confirm valid={ValidLink} invalid={InvalidLink} />
    );
}

export default RecoveryCode;