import './check-box.css';

const CheckBox = (props) => {

    return (

        <>
            <div className="check-box">
                <input type="checkbox" id="remember-me" />
                <label for="remember-me">{props.name}</label>
            </div>
        </>

    );

}

export default CheckBox;