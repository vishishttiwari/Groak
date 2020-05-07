/**
 * This class is used for all authentication api calls
 */
import { auth } from './FirebaseLibrary';

/**
 * This function is called when user needs to login
 *
 * @param {*} email email with which user wants to login
 * @param {*} password password with which user wants to login
 */
export const signinFirebaseAPI = (email, password) => {
    return auth.signInWithEmailAndPassword(email, password);
};

/**
 * This function is used for sending email verification
 */
export const sendEmailVerification = () => {
    return auth.currentUser.sendEmailVerification();
};

/**
 * This function is used for signing out
 */
export const signoutFirebaseAPI = () => {
    return auth.signOut();
};

/**
 * This function is called when user needs to signup
 *
 * @param {*} email email with which user wants to signup
 * @param {*} password password with which user wants to signup
 */
export const signupFirebaseAPI = (email, password) => {
    return auth.createUserWithEmailAndPassword(email, password);
};

/**
 * This function is used for changing the email
 *
 * @param {*} email new email which it will be changed to
 */
export const changeEmailFirebaseAPI = (email) => {
    return auth.currentUser.updateEmail(email);
};

/**
 * This function is called to send the email for password change
 *
 * @param {*} email email where password reset email will be sent
 */
export const changePasswordFirebaseAPI = (email) => {
    return auth.sendPasswordResetEmail(email);
};

/**
 * This is used for changing the display name of profile
 *
 * @param {*} restaurantID display name will be set to restaurantID
 */
export const setDisplayNameFirebaseAPI = (restaurantID) => {
    auth.currentUser.uid = restaurantID;
    auth.currentUser.updateProfile({
        displayName: restaurantID,
    });
};

/**
 * This is used for getting the uid
 */
export const getUIDFirebaseAPI = () => {
    return auth.currentUser.uid;
};

/**
 * This function is used for checking if the user is logged in. If not then this returns null.
 * If logged in then it returns the user.
 */
export const isInitialized = () => {
    return new Promise((resolve) => {
        auth.onAuthStateChanged(resolve);
    });
};

/**
 * This function gets the current user
 */
export const getCurrentUser = () => {
    return auth.currentUser;
};
