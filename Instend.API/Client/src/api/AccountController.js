import { instance } from "../state/application/Interceptors";

class AccountController {
    static GetAccountData = async (onSuccessCallback = () => {}, onErrorCallback = () => {}) => {
        await instance
            .get('/accounts')
            .then((response) => {
                if (response && response.data && response.data.length > 1) {
                    onSuccessCallback(response.data);
                } else {
                    onErrorCallback();
                }
            })
            .catch(error => {
                console.error(error);
                onErrorCallback();
            });
    }

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
    }

    static GetAccountById = async (id) => {
        let friend = null;

        instance.get(`/accounts/id/${id}`)
            .then(response => {
                if (response.data) {
                    friend = response.data;
                }
            });

        return friend;
    }

    static ChangeAccountData = async (name, surname, description, avatar, onSuccess, onError) => {
        let form = new FormData();

        form.append('name', name);
        form.append('surname', surname);
        form.append('description', description);

        if (!!avatar === true) {
            form.append('avatar', avatar);
        }

        await instance.put('/accounts', form)
            .then(response => {
                if (response.status === 200) {
                    onSuccess();
                } else {
                    onError();
                }
            });
    }
}

export default AccountController;