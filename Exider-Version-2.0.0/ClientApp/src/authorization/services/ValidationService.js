class ValidationService {

    static errorMessages = {

        text: "All fields must be completed",
        email: "The email field should look like this: example@gmail.com",
        password: "Your password must contain at least 8 characters"

    };

    static ValidateTextField(value) {

        return [value != null && value.trim() !== '', ValidationService.errorMessages.text];

    }

    static ValidateEmail(email) {

        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return [emailPattern.test(email), ValidationService.errorMessages.email];

    }

    static ValidatePassword(password) {

        return [ValidationService.ValidateTextField(password) &&
            password.length >= 8, ValidationService.errorMessages.password];

    }

}

export default ValidationService;