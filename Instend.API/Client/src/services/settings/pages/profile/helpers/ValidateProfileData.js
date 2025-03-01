import { CalculateAge } from "../../../../../handlers/DateHandler";

export const ValidateProfileData = (name, surname, nickname, dateOfBirth, links = []) => {
    const linkRegex = /^https:\/\/.+/;

    if (!!name === false || name.length > 25)
        return [false, 'Your name must contains more than one symbol and less than 25'];

    if (!!surname === false || surname.length > 25)
        return [false, 'Your surname must contains more than one symbol and less than 25'];

    if (!!nickname === false || nickname.length > 25)
        return [false, 'Your username must contains more than one symbol and less than 25'];

    if (CalculateAge(dateOfBirth) < 5)
        return [false, 'You must be over than 5 years old to use Instend. Please read terms of use and contact us if you have any questions.'];

    for (const link of links) {
        if (!!link.name === false) {
            return [false, 'Name is a required field for each link'];
        }

        if (linkRegex.test(link.link) === false) {
            return [false, 'Each link must redirects to a real page in the internet and looks like: https://example.com/'];
        }
    }

    return [true, ''];
}