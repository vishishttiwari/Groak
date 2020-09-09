import { updateOrderFromUserWhenUserSeenOrderFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';

/**
 * The function is used for updating order by user
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} orderId request id of the request that needs to be fetched
 */
export const updateOrderWhenSeenAPI = async (restaurantId, orderId) => {
    await updateOrderFromUserWhenUserSeenOrderFirestoreAPI(restaurantId, orderId);
};
