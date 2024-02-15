import './styles/colors.css';
import './styles/main.css';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";
import CustomSelect from "../shared/select/Select";
import Notification from "../features/notification/Notification";

const languages = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' }
];

const Layout = ({ children }) => {

    return (

        <>

            <Header />
            <Notification title='Please choose your language'>
                <CustomSelect options={languages} />
            </Notification>
            {children}
            <Footer />

        </>

    );

}

export default Layout;