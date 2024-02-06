import './check-box.css';

const CheckBox = (props) => {

    return (

        <>
            <div className="check-box">
                <input type="checkbox" id="remember-me" />
                <label htmlFor="remember-me">{props.name}</label>
            </div>
        </>

    );

}

export default CheckBox;