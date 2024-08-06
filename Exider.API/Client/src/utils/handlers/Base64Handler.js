class Base64Handler {
    static Base64ToUrlFormatPng = (base64) => {
        return `data:image/png;base64,${base64}`;
    }

    static convertObjectToString = (object) => {
        if (object == null) {
            return '';
        }

        return Object.keys(object)
            .map(key => `${key}=${encodeURIComponent(object[key])}`)
            .join('&');
    }
}

export default Base64Handler;