const ValidateRequest = async (path, value, statusCode) => {

    try {

        const controller = new AbortController();
        const { signal } = controller;

        const timeout = setTimeout(() => {

            controller.abort(); 
            console.warn('Request cancelled: timed out');

        }, 5000);

        const response = await fetch(`${path}/${value}`, { signal });

        clearTimeout(timeout);

        return response.status === statusCode;

    } catch (error) {

        return false;

    }

}

export default ValidateRequest;