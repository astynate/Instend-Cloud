class RegistrationService {

    static async RegisterAsync(user) {

        try {

            const response = await fetch('/accounts', {

                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)

            });

            if (response.status !== 200) {

                throw new Error("Failed to register user");

            }

            return true;

        } catch (error) {

            return false;

        }

    }
}

export default RegistrationService;
