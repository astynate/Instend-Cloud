class AuthentificationController {
    static Authorize = async (email, password, setFormState, setErrorState, navigate) => {
        const userData = new FormData();

        userData.append('username', email);
        userData.append('password', password);
      
        setFormState('loading');
      
        const controller = new AbortController();
        const signal = controller.signal;
      
        const timeoutId = setTimeout(() => {
            controller.abort();
            setFormState('invalid');
        }, 10000);

        try {
            const response = await fetch('/api/authentication', {
                method: 'POST',
                body: userData,
                signal: signal,
            });
      
            clearTimeout(timeoutId);
        
            if (response.status === 200) {
                localStorage.setItem('system_access_token', await response.text());

                navigate('/');
                setFormState('valid');
            } else if (response.status === 470) {
                const confirmationLink = await response.text();
                navigate('/account/email/confirmation/' + confirmationLink);
            } else {
                setErrorState(true);
                setFormState('invalid');
            }
        } catch (error) {
            clearTimeout(timeoutId);
            setFormState('invalid');
            setErrorState(true);
        };
    };
};

export default AuthentificationController;