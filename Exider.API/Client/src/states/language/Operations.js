const GetCurrentLanguage = () => {

    return localStorage.getItem('i18nextLng');

};

const IsLanguageSelected = () => {

    return localStorage.getItem('isLanguageSelected') === 'true';

}

export { GetCurrentLanguage, IsLanguageSelected };