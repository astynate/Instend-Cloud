import AccountController from "../api/AccountController";
import ExploreState from "../state/entities/ExploreState";

class SearchHandler {
    static SearchAll = (prefix, isAvailable, setAvailable = () => {}, timerId, setTimerId) => {
        if (timerId) {
            clearTimeout(timerId);
        };

        if (prefix && prefix !== '' && isAvailable === true) {
            setTimerId(setTimeout(async () => {
                setAvailable(false);
                await AccountController.GetAccountsByPrefix(prefix, ExploreState.setAccounts);
                setAvailable(true);
            }, 700));
        };
    };
};

export default SearchHandler;