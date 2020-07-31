/**
 * This class includes authentication related functions. For example, the signup function signs up
 * the user, creates a demo restaurant and then takes the user to sign up screen.
 */
import { getUIDFirebaseAPI, signinFirebaseAPI, signupFirebaseAPI, sendEmailVerification, isInitialized, signoutFirebaseAPI, changeEmailFirebaseAPI, changePasswordFirebaseAPI } from '../../../firebase/FirebaseAuthenticationAPICalls';
import { addRestaurantFirestoreAPI, fetchRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import * as NotificationsComments from '../../../catalog/NotificationsComments';

/**
 * This function signs out the user and redirects to the signin page.
 *
 * @param {*} history history is used for redirecting pages
 * @param {*} setGlobalState sets the state of the whole application
 * @param {*} snackbar used for notifications
 */
export const signoutAPICall = async (history, setGlobalState, snackbar) => {
    try {
        await signoutFirebaseAPI();
        history.replace('/');
        setGlobalState({ type: 'removeUser' });
    } catch (error) {
        snackbar(error.message, { variant: 'error' });
    }
};

/**
 * This function is used for signing in the user provided that the email is verified and
 * the restaurant exists.
 *
 * @param {*} email this email is used for signing in.
 * @param {*} password this password is used for signing in
 * @param {*} history history is used for redirecting pages
 * @param {*} setState sets the state of the current page
 * @param {*} setGlobalState sets the state of the whole application
 * @param {*} snackbar used for notifications
 */
export const signinAPICall = async (email, password, history, setState, setGlobalState, snackbar) => {
    try {
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        const userInfo = await signinFirebaseAPI(email, password);

        // Checks if the email is verified. If not then do not sign in the user.
        if (userInfo.user.emailVerified) {
            const restaurantId = userInfo.user.uid;
            const doc = await fetchRestaurantFirestoreAPI(restaurantId);

            // Check if the restaurant document exists or not. If not then do not sign in the user.
            if (doc.exists) {
                setGlobalState({ type: 'fetchUser', user: userInfo.user, restaurantId, email, restaurant: doc.data() });
                setState({ type: 'setLoadingSpinner', loadingSpinner: false });
                history.replace('/orders');
            } else {
                await signoutAPICall(history, setGlobalState, snackbar);
                snackbar(NotificationsComments.NotFoundRestaurant, { variant: 'error' });
                setState({ type: 'error' });
            }
        } else {
            await signoutAPICall(history, setGlobalState, snackbar);
            snackbar(NotificationsComments.NotVerifiedEmail, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        await signoutAPICall(history, setGlobalState, snackbar);
        snackbar(error.message, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used to check everytime the user comes back the web app if they are logged in.
 *
 * @param {*} history history is used for redirecting pages
 * @param {*} setGlobalState sets the state of the whole application
 * @param {*} snackbar used for notifications
 */
export const checkAuthentication = async (history, setGlobalState, snackbar) => {
    try {
        isInitialized().then(async (user) => {
            // If user is not verified then redirect to sign in page.
            if (user === null) {
                await signoutAPICall(history, setGlobalState, snackbar);
            } else if (user !== null && user !== false) {
                if (user.emailVerified) {
                    const restaurantId = user.uid;
                    const { email } = user;
                    const doc = await fetchRestaurantFirestoreAPI(restaurantId);

                    // Check if the restaurant document exists or not. If not then do not sign in the user.
                    if (doc.exists) {
                        setGlobalState({ type: 'fetchUser', user, restaurantId, email, restaurant: doc.data() });
                    } else {
                        await signoutAPICall(history, setGlobalState, snackbar);
                        snackbar(NotificationsComments.NotFoundRestaurant, { variant: 'error' });
                    }
                } else {
                    await signoutAPICall(history, setGlobalState, snackbar);
                    snackbar(NotificationsComments.NotVerifiedEmail, { variant: 'error' });
                }
            }
        });
    } catch (error) {
        await signoutAPICall(history, setGlobalState, snackbar);
        snackbar(error.message, { variant: 'error' });
    }
};

/**
 * This function is used for signing up the user. After signing up, the user is logged out so that
 * they first verify the email and only then can enter the portal.
 *
 * @param {*} history history is used for redirecting pages
 * @param {*} state object containing information about restaurant
 * @param {*} setState sets the state of the current page
 * @param {*} snackbar used for notifications
 */
export const signupAPICall = async (history, state, setState, snackbar) => {
    try {
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        await signupFirebaseAPI(state.email, state.password);
        const restaurantId = getUIDFirebaseAPI();
        await addRestaurantFirestoreAPI(restaurantId, state.restaurantName, state.address);
        await sendEmailVerification();
        await signoutFirebaseAPI();
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        snackbar(NotificationsComments.VerificationEmailSent, { variant: 'success' });
        history.replace('/signin');
    } catch (error) {
        await signoutFirebaseAPI();
        history.replace('/signin');
        snackbar(error.message, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for changing the email id for the account
 *
 * @param {*} email new email to which it is changed
 * @param {*} history history is used for redirecting pages
 * @param {*} setState sets the state of the current page
 * @param {*} setGlobalState sets the state of the whole application
 * @param {*} snackbar used for notifications
 */
export const changeEmailAPICall = async (email, history, setState, setGlobalState, snackbar) => {
    try {
        await changeEmailFirebaseAPI(email);
        await sendEmailVerification();
        await signoutAPICall(history, setGlobalState, snackbar);
        snackbar(NotificationsComments.VerificationEmailSent, { variant: 'success' });
    } catch (error) {
        snackbar(error.message, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for sending an email for changing password
 *
 * @param {*} email email to which the password change will be sent
 * @param {*} history history is used for redirecting pages
 * @param {*} setState sets the state of the current page
 * @param {*} setGlobalState sets the state of the whole application
 * @param {*} snackbar used for notifications
 */
export const changePasswordAPICall = async (email, history, setGlobalState, snackbar) => {
    try {
        await changePasswordFirebaseAPI(email);
        await signoutAPICall(history, setGlobalState, snackbar);
        snackbar(NotificationsComments.PasswordVerificationEmailSent, { variant: 'success' });
    } catch (error) {
        snackbar(error.message, { variant: 'error' });
    }
};
