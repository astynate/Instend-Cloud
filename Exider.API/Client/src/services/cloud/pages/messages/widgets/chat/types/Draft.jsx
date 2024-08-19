import { Input } from "reactstrap";

const Draft = ({operation, setDefaultOperation, chat}) => {
    return (
        <Input 
            operation={operation}
            setDefaultOperation={setDefaultOperation}
            chat={chat}
        />
    );
}

export default Draft;