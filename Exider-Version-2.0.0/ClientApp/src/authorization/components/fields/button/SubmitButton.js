import './main.css';

const SubmitButton = (props) => {

    return (
        <>
            <button
                type="submit"
                value={props.value}
                className="button"
                id={props.isDisabled ? 'passive' : 'active'}
                disabled={props.isDisabled ? true : false}
            >
                {props.value}

            </button>
        </>
    );

};

export default SubmitButton;