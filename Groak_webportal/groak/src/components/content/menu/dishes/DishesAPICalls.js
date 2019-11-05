/**
 * This class includes dishes related functions such as fetching all dishes and changing the availability of dish
 */
import { fetchDishesFirestoreAPI, updateDishFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { ErrorFetchingDishes, ErrorChangingAvailability } from '../../../../catalog/NotificationsComments';

/**
 * This is used for fetching the dishes
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the dishes array
 * @param {*} snackbar used for notifications
 */
export const fetchDishesAPI = async (restaurantId, setState, snackbar) => {
    const newDishes = [];
    try {
        const docs = await fetchDishesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            newDishes.push({ id: doc.id, ...doc.data() });
        });
        setState({ type: 'fetchDishes', dishes: newDishes });
    } catch (error) {
        snackbar(ErrorFetchingDishes, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This is used for changing the availabilty of the dishes
 *
 * @param {*} dishes dishes array
 * @param {*} setState this is used for setting the dishes array
 * @param {*} changedDish this is the dish for which the availability is being changed
 * @param {*} snackbar used for notifications
 */
export const changeAvailabilityOfDishAPI = async (restaurantId, dishes, setState, changedDish, snackbar) => {
    try {
        await updateDishFirestoreAPI(restaurantId, changedDish.id, { available: changedDish.available });
        setState({
            type: 'setDish',
            dishes: dishes.map((dish) => {
                if (dish.id !== changedDish.id) { return dish; }
                return changedDish;
            }),
        });
    } catch (error) {
        snackbar(ErrorChangingAvailability, { variant: 'error' });
        setState({ type: 'error' });
    }
};
