import { addOrderFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';

/**
 * The function is used for adding order by user
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} orderId request id of the request that needs to be fetched
 * @param {*} cart
 * @param {*} specialInstructions
 */
export const addOrderAPI = async (restaurantId, orderId, cart, specialInstructions) => {
    await addOrderFirestoreAPI(restaurantId, orderId, cart, specialInstructions);
};
