/**
 * This class includes fetching categories and dishes in each categories
 */
import { fetchCategoriesInArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishesInArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingCategories, ErrorUnsubscribingOrder, ErrorFetchingOrder, ErrorUpdatingOrder } from '../../../catalog/NotificationsComments';
import { fetchQRCodeFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { checkCategoryAvailability, checkQRCodeAvailability, checkDishAvailability } from '../../../catalog/Others';
import { fetchOrderFirestoreAPI, updateOrderFromUserFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { checkOrderLocallity } from '../../../catalog/LocalStorage';

let orderSnapshot;

/**
 * Function used to get restaurant name and restaurant logo
 *
 * @param {*} restaurantId
 * @param {*} snacbar
 */
export const fetchRestaurantAPI = async (restaurantId) => {
    try {
        const doc = await fetchRestaurantFirestoreAPI(restaurantId);

        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return {};
    } catch (error) {
        return {};
    }
};

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, qrCodeId, dontCheckAvailability, setState, setGlobalState, snackbar) => {
    const categories = [];
    const categoryNames = [];
    const menuItems = new Map();

    try {
        const restaurant = await fetchRestaurantAPI(restaurantId);
        const data = await fetchQRCodeFirestoreAPI(restaurantId, qrCodeId);

        if (data.exists && data.data()) {
            if (dontCheckAvailability || checkQRCodeAvailability(data.data())) {
                const docs = await fetchCategoriesInArrayFirestoreAPI(data.data().categories);

                docs.forEach((doc) => {
                    if (doc.exists) {
                        const category = { id: doc.id, ...doc.data() };
                        if (dontCheckAvailability || checkCategoryAvailability(category)) {
                            categories.push(category);
                            categoryNames.push(category.name);
                            menuItems.set(doc.id, []);
                        }
                    }
                });

                await Promise.all(categories.map(async (category) => {
                    const docs1 = await fetchDishesInArrayFirestoreAPI(category.dishes);
                    const dishes = [];
                    docs1.forEach((doc) => {
                        if (doc.exists) {
                            const dish = { id: doc.id, ...doc.data() };
                            if (dontCheckAvailability || checkDishAvailability(dish)) {
                                dishes.push(dish);
                            }
                        }
                    });
                    menuItems.set(category.id, dishes);
                }));
                if (categories.length === 0) {
                    setState({ type: 'categoriesNotFound' });
                } else {
                    setGlobalState({ type: 'setRestaurantCustomer', restaurant });
                    setState({ type: 'fetchMenuItems', categoryNames, menuItems, restaurant });
                }
            } else {
                setState({ type: 'categoriesNotFound' });
            }
        } else {
            setState({ type: 'restaurantNotFound' });
        }
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for unsubscribing from realtime updates of order
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchOrderAPI = (snackbar) => {
    try {
        if (orderSnapshot) {
            orderSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingOrder, { variant: 'error' });
    }
};

/**
 * The function is used for fetching order
 *
 * @param {*} restaurantId id of the restaurant for which order needs to be fetched
 * @param {*} orderId order id of the order that needs to be fetched
 * @param {*} setState used for setting the order
 * @param {*} snackbar used for notifications
 */
export const fetchOrderAPI = async (restaurantId, orderId, setState, snackbar) => {
    try {
        const getOrder = (querySnapshot) => {
            if (querySnapshot.data()) {
                const { dishes, comments } = querySnapshot.data();
                const updatedDishes = [];
                const updatedComments = [];
                dishes.forEach((dish) => {
                    updatedDishes.push({ ...dish, local: checkOrderLocallity(restaurantId, dish.reference) });
                });
                comments.forEach((comment) => {
                    updatedComments.push({ ...comment, local: checkOrderLocallity(restaurantId, comment.reference) });
                });
                setState({
                    type: 'fetchOrder',
                    order: { ...querySnapshot.data(), dishes: updatedDishes, comments: updatedComments },
                });
            } else {
                snackbar(ErrorFetchingOrder, { variant: 'error' });
                setState({ type: 'error' });
            }
        };
        orderSnapshot = await fetchOrderFirestoreAPI(restaurantId, orderId, getOrder);
    } catch (error) {
        snackbar(ErrorFetchingOrder, { variant: 'error' });
        setState({ type: 'error' });
    }
};

export const updateOrderAPI = async (restaurantId, orderId, newStatus, snackbar) => {
    try {
        await updateOrderFromUserFirestoreAPI(restaurantId, orderId, newStatus);
    } catch (error) {
        snackbar(ErrorUpdatingOrder, { variant: 'error' });
    }
};
