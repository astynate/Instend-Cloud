import '../main.css';

const SimpleField = (props) => {

    return (

        <div className="input-wrapper">
            <input
                type="text"
                name={props && props.name ? props.name : 'name'}
                placeholder={props && props.placeholder ? props.placeholder : 'Name'}
                maxLength={props && props.max ? props.max : '40'}
            />
        </div>

    );

}

export default SimpleField;