/**
 * This function is used if emails and password entered are valid or not
 */
import * as NotificationsComments from './NotificationsComments';

/**
 * This function checks password
 *
 * @param {*} password this is the passwword that needs to be checked
 * @param {*} setState this is used for emptying the text field
 * @param {*} snackbar this is used for notifications
 */
export const checkPasswordValidity = (password, setState, snackbar) => {
    if (password.length < 6) {
        snackbar(NotificationsComments.No6CharactersPassword, { variant: 'error' });
        setState({ type: 'removePassword' });
        return false;
    }
    if (!/\d/g.test(password)) {
        snackbar(NotificationsComments.NoDigitPassword, { variant: 'error' });
        setState({ type: 'removePassword' });
        return false;
    }
    if (!/[a-z]/i.test(password)) {
        snackbar(NotificationsComments.NoLetterPassword, { variant: 'error' });
        setState({ type: 'removePassword' });
        return false;
    }
    return (true);
};

/**
 * This function checks email
 *
 * @param {*} email this is the passwword that needs to be checked
 * @param {*} setState this is used for emptying the text field
 * @param {*} snackbar this is used for notifications
 */
export const checkEmailValidity = (email, setState, snackbar) => {
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        return (true);
    }
    snackbar(NotificationsComments.InvalidEmail, { variant: 'error' });
    setState({ type: 'error' });
    return (false);
};
