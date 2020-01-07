/**
 * This class implements all firebase APIs related to fetching orders
 */
import { fetchOrdersFirestoreAPI, fetchOrderFirestoreAPI, updateOrderFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { fetchRequestFirestoreAPI, updateRequestFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRequests';
import { differenceInMinutesFromNow } from '../../../catalog/TimesDates';
import { TableStatus } from '../../../catalog/Others';
import { ErrorFetchingOrders, ErrorFetchingOrder, ErrorUpdatingOrder, ErrorUnsubscribingOrders, ErrorUnsubscribingOrder, OrderAdded, OrderUpdated, OrderReadyForPayment, ErrorFetchingRequest, ErrorUnsubscribingRequest, ErrorUpdatingRequest } from '../../../catalog/NotificationsComments';

let ordersSnapshot;
let orderSnapshot;

/**
 * This function is used for unsubscribing from realtime updates of orders
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchOrdersAPI = (snackbar) => {
    try {
        if (ordersSnapshot) {
            ordersSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingOrders, { variant: 'error' });
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
 * This function is used for fetching orders
 *
 * @param {*} restaurantId id of the restaurant for which orders needs to be fetched
 * @param {*} state contains all the orders
 * @param {*} setState used for setting the order
 * @param {*} snackbar used for notifications
 */
export const fetchOrdersAPI = async (restaurantId, state, setState, snackbar) => {
    try {
        let newNewOrders = [...state.newOrders];
        let newUpdatedOrders = [...state.updatedOrders];
        let newCurrentOrders = [...state.currentOrders];
        let newOverdueOrders = [...state.overdueOrders];
        let newServedOrders = [...state.servedOrders];
        let newPaymentOrders = [...state.paymentOrders];
        const getOrders = (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                // This is called whenever the orders page is loaded. This calls no notifications
                // The modified if is called whenever something is changed while we are at the page.
                if (change.type === 'added') {
                    const { status } = change.doc.data();
                    if (status === TableStatus.ordered) {
                        newNewOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === TableStatus.updated || status === TableStatus.requested) {
                        newUpdatedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === TableStatus.approved) {
                        if (differenceInMinutesFromNow(change.doc.data().serveTime) < 0) {
                            newOverdueOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        } else {
                            newCurrentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        }
                    } else if (status === TableStatus.served) {
                        newServedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === TableStatus.payment) {
                        newPaymentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    }
                } else if (change.type === 'modified') {
                    const { status } = change.doc.data();
                    // First delete this order from every other table and then add it to whichever table it needs to be added
                    newNewOrders = newNewOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    newUpdatedOrders = newUpdatedOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    newCurrentOrders = newCurrentOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    newOverdueOrders = newOverdueOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    newServedOrders = newServedOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    newPaymentOrders = newPaymentOrders.filter((order) => {
                        return (order.id !== change.doc.id);
                    });
                    // Make sure on client that do not change status to updated if status is requested
                    if (status === TableStatus.ordered) {
                        newNewOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        snackbar(OrderAdded(change.doc.data().table), { variant: 'success' });
                    } else if (status === TableStatus.updated || status === TableStatus.requested) {
                        newUpdatedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        snackbar(OrderUpdated(change.doc.data().table), { variant: 'info' });
                    } else if (status === TableStatus.approved) {
                        if (differenceInMinutesFromNow(change.doc.data().serveTime) < 0) {
                            newOverdueOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        } else {
                            newCurrentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        }
                    } else if (status === TableStatus.served) {
                        newServedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === TableStatus.payment) {
                        newPaymentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        snackbar(OrderReadyForPayment(change.doc.data().table), { variant: 'info' });
                    }
                }
            });
            setState({ type: 'fetchOrders',
                newOrders: newNewOrders,
                updatedOrders: newUpdatedOrders,
                currentOrders: newCurrentOrders,
                overdueOrders: newOverdueOrders,
                servedOrders: newServedOrders,
                paymentOrders: newPaymentOrders,
            });
        };
        ordersSnapshot = await fetchOrdersFirestoreAPI(restaurantId, getOrders);
    } catch (error) {
        snackbar(ErrorFetchingOrders, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchOrdersAPI(snackbar);
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
                setState({
                    type: 'fetchOrder',
                    status: querySnapshot.data().status,
                    comments: querySnapshot.data().comments,
                    serve: querySnapshot.data().serveTime,
                    dishes: querySnapshot.data().dishes,
                });
            } else {
                snackbar(ErrorFetchingOrder, { variant: 'error' });
                setState({ type: 'error' });
                unsubscribeFetchOrderAPI(snackbar);
            }
        };
        orderSnapshot = await fetchOrderFirestoreAPI(restaurantId, orderId, getOrder);
    } catch (error) {
        snackbar(ErrorFetchingOrder, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchOrderAPI(snackbar);
    }
};

/**
 * The function is used for updating order
 *
 * @param {*} restaurantId id of the restaurant for which order is updated
 * @param {*} orderId id of the order for updating
 * @param {*} data contains information that needs to be updated
 * @param {*} snackbar used for notifications
 */
export const updateOrderAPI = async (restaurantId, orderId, data, snackbar) => {
    try {
        await updateOrderFirestoreAPI(restaurantId, orderId, data);
    } catch (error) {
        snackbar(ErrorUpdatingOrder, { variant: 'error' });
    }
};

let requestSnapshot;

/**
 * This function is used for unsubscribing from realtime updates of request
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchRequestAPI = (snackbar) => {
    try {
        if (requestSnapshot) {
            requestSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingRequest, { variant: 'error' });
    }
};

/**
 * The function is used for fetching request
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} requestId request id of the request that needs to be fetched
 * @param {*} setState used for setting the request
 * @param {*} snackbar used for notifications
 */
export const fetchRequestAPI = async (restaurantId, requestId, setState, snackbar) => {
    try {
        const getRequest = (querySnapshot) => {
            if (querySnapshot.data()) {
                setState({
                    type: 'setRequest',
                    request: querySnapshot.data().requests,
                });
            } else {
                snackbar(ErrorFetchingRequest, { variant: 'error' });
                setState({ type: 'error' });
                unsubscribeFetchRequestAPI(snackbar);
            }
        };
        requestSnapshot = await fetchRequestFirestoreAPI(restaurantId, requestId, getRequest);
    } catch (error) {
        snackbar(ErrorFetchingRequest, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchRequestAPI(snackbar);
    }
};

/**
 * The function is used for adding request by restaurant
 *
 * @param {*} restaurantId id of the restaurant for which request needs to be fetched
 * @param {*} requestId request id of the request that needs to be fetched
 * @param {*} setState used for setting the request
 * @param {*} snackbar used for notifications
 */
export const updateRequestAPI = async (restaurantId, requestId, data, snackbar) => {
    try {
        await updateRequestFirestoreAPI(restaurantId, requestId, data)
    } catch (error) {
        snackbar(ErrorUpdatingRequest, { variant: 'error' });
        unsubscribeFetchRequestAPI(snackbar);
    }
};