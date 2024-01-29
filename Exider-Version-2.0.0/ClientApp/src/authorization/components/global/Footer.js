import Navigation from './Navigation';

const Footer = () => {

    return (

        <>
            <div className="footer">
                <div className="left">
                    <span>© Andreev S, Minsk 2024</span>
                </div>
                <Navigation />
                <div className="right">
                    <a href="#">Terms of use</a>
                    <a href="#">Privacy policy</a>
                    <a href="#">Report a bug</a>
                </div>
            </div>
        </>

    );

};

export default Footer;