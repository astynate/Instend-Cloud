import './styles/colors.css';
import './styles/main.css';
import Header from "../widgets/header/Header";
import Footer from "../widgets/footer/Footer";

const Layout = ({ children }) => {

    return (

        <>

            <Header />
            {children}
            <Footer />

        </>

    );

}

export default Layout;