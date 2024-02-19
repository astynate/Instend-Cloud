import { instance } from './Interceptors';

export const GetCurrentLanguage = () => {
    return localStorage.getItem('i18nextLng');
};

export const IsLanguageSelected = () => {
    return localStorage.getItem('isLanguageSelected') === 'true';
}

export const GetAuthorizationState = async () => {

    try {

        const response = await instance.get('/authentication', {
            params: {
                accessToken: localStorage.getItem('system_access_token')
            },
        });

        return response.status === 200;

    } catch (error) {

        console.error(error);
        return false;

    }

}