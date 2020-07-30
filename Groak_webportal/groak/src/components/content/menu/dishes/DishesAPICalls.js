/**
 * This class includes dishes related functions such as fetching all dishes and changing the availability of dish
 */
import { fetchDishesFirestoreAPI, updateDishFirestoreAPI, changeOrderOfDishesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { DishUpdated, ErrorFetchingDishes, ErrorChangingAvailability, DishOrderChanged, ErrorChangingDishOrder } from '../../../../catalog/NotificationsComments';

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
            type: 'setDishes',
            dishes: dishes.map((dish) => {
                if (dish.id !== changedDish.id) { return dish; }
                return changedDish;
            }),
        });
        snackbar(DishUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingAvailability, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * Used for changing order of dishes
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} dishReferences id of the references of all dishes
 * @param {*} snackbar used for notifications
 */
export const changeDishOrderAPI = async (restaurantId, dishReferences, snackbar) => {
    try {
        await changeOrderOfDishesFirestoreAPI(restaurantId, dishReferences);
        snackbar(DishOrderChanged, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingDishOrder, { variant: 'error' });
    }
};
