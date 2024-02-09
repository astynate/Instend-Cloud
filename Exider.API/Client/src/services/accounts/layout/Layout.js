import './styles/colors.css'
import Header from "../widgets/header/Header";

const Layout = ({ children }) => {

    return (

        <>

            <Header />
            {children}

        </>

    );

}

export default Layout;