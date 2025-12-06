import { instance } from "../state/application/Interceptors";

class AccountController {
    static GetAccountData = async (onSuccessCallback = () => {}, onErrorCallback = () => {}, id = '') => {
        await instance
            .get(`/api/accounts?id=${id}`)
            .then((response) => {
                if (response && response.data) {
                    onSuccessCallback(response.data);
                } else {
                    onErrorCallback();
                }
            })
            .catch(error => {
                console.error(error);
                onErrorCallback();
            });
    };

    static GetUserPublications = async () => {
        let publications = [];

        await instance
            .get(`/api/user-publications?id=${this.user.id}`)
            .then(reponse => {
                if (reponse && reponse.data && reponse.data.length && reponse.data.length > 0) {
                    publications = reponse.data;
                }
            });

        return publications;
    };

    static GetAccountById = async (id) => {
        let friend = null;

        instance.get(`/api/accounts/id/${id}`)
            .then(response => {
                if (response.data) {
                    friend = response.data;
                };
            });

        return friend;
    };

    static ChangeAccountData = async (name, surname, nickname, description, avatar, dateOfBirth, links, onSuccess, onError) => {
        let form = new FormData();

        form.append('name', name);
        form.append('surname', surname);
        form.append('nickname', nickname);
        form.append('description', description);
        form.append('dateOfBirth', dateOfBirth);

        if (!!avatar === true) {
            form.append('avatar', avatar);
        };

        for (let i = 0; i < links.length; i++) {
            form.append(`links[${i}].Id`, links[i].id);
            form.append(`links[${i}].LinkId`, links[i].linkId);
            form.append(`links[${i}].Name`, links[i].name);
            form.append(`links[${i}].Link`, links[i].link);
            form.append(`links[${i}].AccountId`, links[i].accountId);
        }

        await instance
            .put('/api/accounts', form)
            .then(response => {
                if (response && response.status === 200) {
                    onSuccess();
                } else {
                    onError();
                }
            })
            .catch(error => {
                console.error(error);
                onError();
            });
    };

    static GetAccountPhotos = async (accountId, setState = () => {}, skip) => {
        await instance
            .get(`/api/accounts/photos?accountId=${accountId}&skip=${skip}`)
            .then(response => {
                if (response && response.data) {
                    setState(prev => [...prev, ...response.data]);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    static GetAccountsByPrefix = async (prefix, setState) => {
        if (!!prefix === false)
            return;

        await instance
            .get(`/api/accounts/all/${prefix}`)
            .then(response => {
                if (response && response.data) {
                    setState(response.data);
                }
            })
            .catch(error => {
                console.error(error);
            });
    };

    static SendRegistrationRequest = async (setValidationState, setErrorState, navigate, user = {}) => {
        try {
            setValidationState('loading');

            const response = await fetch("/api/accounts", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (response.status === 200) {
                const responseData = await response.text();

                navigate(`/account/email/confirmation/${responseData}`.replaceAll('"', ''), { replace: true });
                setValidationState('valid');
            } else {
                setErrorState(true);
                setValidationState('invalid');
            };

        } catch (exception) {
            console.error(exception);

            setErrorState(true);
            setValidationState('invalid');
        };
    };
};

export default AccountController;