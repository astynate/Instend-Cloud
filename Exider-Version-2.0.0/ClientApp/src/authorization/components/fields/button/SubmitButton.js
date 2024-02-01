import './main.css';

const SubmitButton = (props) => {

    return (
        <>
            <button
                type="submit"
                value={props.value}
                className="button"
                id={props.isDisabled ? 'passive' : 'active'}
                onClick={props.onClick}
            >
                {props.value}

            </button>
        </>
    );

};

export default SubmitButton;