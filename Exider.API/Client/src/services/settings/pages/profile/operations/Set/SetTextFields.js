export const setName = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        name: value
    }));

};

export const setSurname = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        surname: value
    })); 

};

export const setNickname = (value, setContext) => {

    setContext(prev => ({
        ...prev,
        nickname: value
    }));

};