class ValidationHandler {

    static ValidateEmail(email) {

        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);

    }

    static ValidateVarchar(field, maxLength) {

        return field.length > 0 && field.length < maxLength;

    }

    static ValidateStrings(fields) {

        return !(fields.some(field => ValidationHandler
            .ValidateVarchar(field, 31) === false));

    }

}

export default ValidationHandler;