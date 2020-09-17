import { ErrorUnsubscribingOrder, ErrorFetchingOrder, ErrorUpdatingOrder } from '../../../catalog/NotificationsComments';
import { fetchOrderFirestoreAPI, updateOrderFromUserFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { checkOrderLocallity } from '../../../catalog/LocalStorage';

let orderSnapshot;

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

export const updateOrderAPI = async (restaurantId, orderId, newStatus, tip, paymentMethod, snackbar) => {
    try {
        await updateOrderFromUserFirestoreAPI(restaurantId, orderId, newStatus, tip, paymentMethod);
    } catch (error) {
        snackbar(ErrorUpdatingOrder, { variant: 'error' });
    }
};
