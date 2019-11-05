/**
 * This class includes restaurant related functions such as fetching a restaurant or updating a restaurant
 */
import { updateRestaurantFirestoreAPI, addRestaurantLogoFirestoreAPI, getRestaurantLogoURLFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorUpdatingRestaurant } from '../../../catalog/NotificationsComments';

/**
 * This function first checks if an image needs to be uploaded. If yes then it uploads image, then gets the reference,
 * then updates the restaurant with image and other information. If image doe snot need to be updated then it
 * just updates the restauarnt with necessary information.
 *
 * @param {*} restaurantId restaurant ID
 * @param {*} data this is the new data
 * @param {*} logo this logo is the logo of the restaurant
 * @param {*} setState sets the state of the current page
 * @param {*} snackbar used for notifications
 */
export const updateRestaurantAPI = async (restaurantId, data, logo, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        let updatedData;

        // If logo is updated then upload logo and add url to the data
        if (logo && logo.file) {
            const { ref, promise } = addRestaurantLogoFirestoreAPI(restaurantId, data.name, logo.file);
            await promise;
            const url = await getRestaurantLogoURLFirestoreAPI(ref);
            updatedData = { ...data, logo: url };
        } else {
            updatedData = { ...data, logo: logo.link };
        }
        await updateRestaurantFirestoreAPI(restaurantId, updatedData);
        setGlobalState({ type: 'setRestaurant', restaurant: updatedData });
    } catch (error) {
        snackbar(ErrorUpdatingRestaurant, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};
