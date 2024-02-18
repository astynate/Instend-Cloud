export const GetCurrentLanguage = () => {

    return localStorage.getItem('i18nextLng');

};

export const IsLanguageSelected = () => {

    return localStorage.getItem('isLanguageSelected') === 'true';

}

export const GetAuthorizationState = () => {



}