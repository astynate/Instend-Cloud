import info from './images/info.png';
import './css/alert.css';

const AlertService = (props) => {

    return (

        <>

            <div className="alert">
                <img src={info} className="image" />
                <span>{(props && props.message) || "None"}</span>
            </div>

        </>
    
    );

}

export default AlertService;