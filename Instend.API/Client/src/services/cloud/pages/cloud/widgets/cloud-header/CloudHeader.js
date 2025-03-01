import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import styles from './main.module.css';
import openImage from './images/open.png';
import StorageState from "../../../../../../state/entities/StorageState";

const CloudHeader = observer(({}) => {
    const [isOpen, setOpenState] = useState(false);
    const { path } = StorageState;
    const ref = useRef();

    const close = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenState(false);
      }
    };

    useEffect(() => {
      document.addEventListener('click', close);
    
      return () => {
        document.removeEventListener('click', close);
      };
    }, []);

    return (
      <div className={styles.cloudHeader} ref={ref}>
        <div className={styles.title} onClick={() => setOpenState(p => !p)}>
          <h1>{path.length > 0 ? path[0].name : "Instend Cloud"}</h1>
          <img src={openImage} draggable='false' />
        </div>
        {isOpen && <div className={styles.titleItems}>
          {path.length > 0 && path.map(collection => {
            return (
              <Link 
                to={`/cloud/${collection.id}`} 
                key={collection.id}
                onClick={() => setOpenState(false)}
              >
                {collection.name}
              </Link>
            )
          })}
          <Link 
            to={`/cloud`} 
            onClick={() => setOpenState(false)}
          >
            Instend Cloud
          </Link>
        </div>}
      </div>
    );
});
  
export default CloudHeader;