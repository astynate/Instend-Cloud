class AccountController {
    static SendRecoveryRequest = async (setButtonState) => {
        const controller = new AbortController();
        const { signal } = controller;
    
        setButtonState('loading');
    
        const timeoutId = setTimeout(() => {
            controller.abort();
        }, 5000);
    
        const response = await fetch(`/api/password-recovery?email=${email}`, { signal, method: 'POST' });
        const confirmationLink = await response.text();
    
        if (response.status === 200) {
            navigate(`/api/account/password/recovery/${confirmationLink}`);
            setButtonState('valid');
        } else {
            setErrorState(true);
            setButtonState('invalid');
        };
    
        clearTimeout(timeoutId);
    };
};

export default AccountController;