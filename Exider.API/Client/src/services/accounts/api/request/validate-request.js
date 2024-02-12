const ValidateRequest = async (path, data) => {

    try {

        const controller = new AbortController();
        const { signal } = controller;
        const params = new URLSearchParams();

        params.append(data[0], data[1]);

        const timeout = setTimeout(() => {

            controller.abort(); 
            console.warn('Request cancelled: timed out');

        }, 5000);

        const response = await fetch(`${path}?${params}`, { signal });

        clearTimeout(timeout);

        return response.ok;

    } catch (error) {

        return false;

    }

}

export default ValidateRequest;