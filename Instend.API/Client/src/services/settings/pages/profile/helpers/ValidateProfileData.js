import { CalculateAge } from "../../../../../utils/handlers/DateHandler";

export const ValidateProfileData = (name, surname, nickname, dateOfBirth) => {
    if (!!name === false || name.length > 25)
        return [false, 'Your name must contains more than one symbol and less than 25'];

    if (!!surname === false || surname.length > 25)
        return [false, 'Your surname must contains more than one symbol and less than 25'];

    if (!!nickname === false || nickname.length > 25)
        return [false, 'Your username must contains more than one symbol and less than 25'];

    if (CalculateAge(dateOfBirth) < 5)
        return [false, 'You must be over than 5 years old to use Instend. Please read terms of use and contact us if you have any questions.'];

    return [true, ''];
}