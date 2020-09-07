import { fetchDishFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { randomNumber } from '../../../catalog/Others';

/**
 * This function fetches the data from server, then converts it into a form that
 * the component will understand. This includes coonverting numbers into string,
 * adding keys to extras and ingredients so that the map can show it correctly.
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} setState this is used for setting the state of component with correct information
 * @param {*} snackbar this is used for notifications
 */
export const fetchDishAPI = async (restaurantId, dishId, setState) => {
    try {
        const doc = await fetchDishFirestoreAPI(restaurantId, dishId);

        // Check if such a dish exists
        if (doc.exists) {
            let updatedExtras = [];

            // If extras exists then break it into a form that the component will understand. This includes adding key for map
            if (doc.data().extras) {
                updatedExtras = doc.data().extras.map((extra) => {
                    const updatedExtra = { ...extra, id: randomNumber() };
                    updatedExtra.minOptionsSelect = extra.minOptionsSelect ? extra.minOptionsSelect : 0;
                    updatedExtra.maxOptionsSelect = extra.maxOptionsSelect ? extra.maxOptionsSelect : extra.options.length;
                    updatedExtra.options = extra.options.map((option) => {
                        const updatedOption = { ...option, id: randomNumber() };
                        updatedOption.price = option.price ? option.price : -1;
                        return updatedOption;
                    });
                    return updatedExtra;
                });
            }

            setState({
                type: 'fetchDish',
                dish: { ...doc.data(), id: doc.id, extras: updatedExtras },
            });
        } else {
            setState({ type: 'error' });
        }
    } catch (error) {
        setState({ type: 'error' });
    }
};
