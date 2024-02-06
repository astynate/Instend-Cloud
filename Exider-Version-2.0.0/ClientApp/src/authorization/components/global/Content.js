const Content = ({ children }) => {

    return (

        <div className="content">
            <form className="form">
                {children}
            </form>
        </div>

    );

};

export default Content;