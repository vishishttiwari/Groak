/**
 * This class includes fetching categories and dishes in each categories
 */
import { fetchCategoriesFromArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishesFromArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingCategories, ErrorUnsubscribingOrder } from '../../../catalog/NotificationsComments';
import { fetchQRCodeFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { checkCategoryAvailability, checkQRCodeAvailability, checkDishAvailability, frontDoorQRMenuPageId, TableStatus, viewOnlyQRMenuPageId } from '../../../catalog/Others';
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

export const updateOrderAPI = async (restaurantId, orderId, newStatus) => {
    await updateOrderFromUserFirestoreAPI(restaurantId, orderId, newStatus);
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
export const fetchOrderAPI = async (restaurant, restaurantId, orderId, setState, setGlobalState) => {
    try {
        const getOrder = async (querySnapshot) => {
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
                setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: true });
                await updateOrderAPI(restaurantId, orderId, TableStatus.seated);
            } else {
                setState({ type: 'fetchOrder', order: {} });
                setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: false });
            }
        };
        orderSnapshot = await fetchOrderFirestoreAPI(restaurantId, orderId, getOrder);
    } catch (error) {
        setState({ type: 'fetchOrder', order: {} });
        setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: false });
    }
};

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, tableId, qrCodeId, dontCheckAvailability, setState, setGlobalState, snackbar) => {
    const categories = [];
    const categoryNames = [];
    const menuItems = new Map();
    const startTimeMap = new Map();
    const endTimeMap = new Map();

    try {
        const restaurant = await fetchRestaurantAPI(restaurantId);
        const data = await fetchQRCodeFirestoreAPI(restaurantId, qrCodeId);

        if (data.exists && data.data()) {
            if (dontCheckAvailability || checkQRCodeAvailability(data.data())) {
                const docs = await fetchCategoriesFromArrayFirestoreAPI(data.data().categories);

                docs.forEach((doc) => {
                    if (doc.exists) {
                        const category = { id: doc.id, ...doc.data() };
                        if (dontCheckAvailability || checkCategoryAvailability(category)) {
                            categories.push(category);
                            categoryNames.push(category.name);
                            menuItems.set(doc.id, []);
                        }
                        category.days.forEach((tempDay) => {
                            const startTime = startTimeMap.get(tempDay);
                            const endTime = endTimeMap.get(tempDay);
                            if (startTime) {
                                startTimeMap.set(tempDay, Math.min(startTime, category.startTime[tempDay]));
                            } else {
                                startTimeMap.set(tempDay, category.startTime[tempDay]);
                            }
                            if (endTime) {
                                endTimeMap.set(tempDay, Math.max(endTime, category.endTime[tempDay]));
                            } else {
                                endTimeMap.set(tempDay, category.endTime[tempDay]);
                            }
                        });
                    }
                });

                await Promise.all(categories.map(async (category) => {
                    const docs1 = await fetchDishesFromArrayFirestoreAPI(category.dishes);
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
                    setState({ type: 'categoriesNotFound', startTimeMap, endTimeMap });
                } else {
                    setState({ type: 'fetchMenuItems', categoryNames, menuItems, restaurant });
                    if (tableId === frontDoorQRMenuPageId) {
                        setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: false });
                    } else if (tableId === viewOnlyQRMenuPageId) {
                        setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: false });
                    } else if (!restaurant
                        || !restaurant.allowOrdering
                        || !restaurant.allowOrdering.restaurant
                        || !restaurant.allowOrdering.groak) {
                        setGlobalState({ type: 'setRestaurantCustomer', restaurant, orderAllowed: false });
                    } else {
                        await fetchOrderAPI(restaurant, restaurantId, tableId, setState, setGlobalState);
                    }
                }
            } else {
                const docs = await fetchCategoriesFromArrayFirestoreAPI(data.data().categories);

                docs.forEach((doc) => {
                    if (doc.exists) {
                        const category = { id: doc.id, ...doc.data() };
                        category.days.forEach((tempDay) => {
                            const startTime = startTimeMap.get(tempDay);
                            const endTime = endTimeMap.get(tempDay);
                            if (startTime) {
                                startTimeMap.set(tempDay, Math.min(startTime, category.startTime[tempDay]));
                            } else {
                                startTimeMap.set(tempDay, category.startTime[tempDay]);
                            }
                            if (endTime) {
                                endTimeMap.set(tempDay, Math.max(endTime, category.endTime[tempDay]));
                            } else {
                                endTimeMap.set(tempDay, category.endTime[tempDay]);
                            }
                        });
                    }
                });
                setState({ type: 'categoriesNotFound', startTimeMap, endTimeMap });
            }
        } else {
            setState({ type: 'restaurantNotFound' });
        }
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
};
