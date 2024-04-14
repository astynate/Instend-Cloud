import React, { useContext, useEffect, useState } from 'react';
import styles from './main.module.css';
import search from '../../images/search.png';
import { OpenAccessContext } from '../../../../pages/cloud/widgets/open-access/OpenAccess';
import { instance } from '../../../../../../state/Interceptors';

const Search = () => {
    const [prefix, setPrefix] = useState('');
    const context = useContext(OpenAccessContext);
    const [prevTimer, setPrevTimer] = useState();

    useEffect(() => {
        const GetUsers = async () => {
            const response = await instance.get(`/accounts/all/${prefix}`);
            context.setSearchUsers(response.data);
        };

        if (prefix != null && prefix != "") {
            if (prevTimer) {
                clearTimeout(prevTimer);
            }
            const timer = setTimeout(GetUsers, 350);
            setPrevTimer(timer);
        }
    }, [prefix]);

    return (
        <div className={styles.search}>
            <img src={search} draggable={false} />
            <input 
                placeholder='Search' 
                value={prefix} 
                onChange={(event) => setPrefix(event.target.value)} 
            />
        </div>
    );

};

export default Search;
