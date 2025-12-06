class ConfirmationController {
    static Get = async (setLinkState, setEmail, id) => {
        try {
            const controller = new AbortController();
            const { signal } = controller;
            const timeoutId = setTimeout(() => controller.abort(), 7000);
            const response = await fetch('/api/confirmations/link/' + id.toString(), { signal });

            if (response.status === 200) {
                const responseData = await response.text();

                setLinkState('valid');
                setEmail(responseData);
            } else {
                setLinkState('invalid');
            };

            clearTimeout(timeoutId);
        } catch (error) {
            setLinkState('invalid');
        };
    };
};

export default ConfirmationController;