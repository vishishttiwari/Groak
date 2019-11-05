/**
 * This class implements all firebase APIs related to fetching orders
 */
import { fetchOrdersFirestoreAPI, fetchOrderFirestoreAPI, updateOrderFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsOrders';
import { differenceInMinutesFromNow } from '../../../catalog/TimesDates';
import { OrderStatus } from '../../../catalog/Others';
import { ErrorFetchingOrders, ErrorFetchingOrder, ErrorUpdatingOrder, ErrorUnsubscribingOrders, ErrorUnsubscribingOrder, OrderAdded, OrderUpdated, OrderReadyForPayment } from '../../../catalog/NotificationsComments';

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
                    if (status === OrderStatus.ordered) {
                        newNewOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === OrderStatus.updated || status === OrderStatus.requested) {
                        newUpdatedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === OrderStatus.approved) {
                        if (differenceInMinutesFromNow(change.doc.data().serveTime) < 0) {
                            newOverdueOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        } else {
                            newCurrentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        }
                    } else if (status === OrderStatus.served) {
                        newServedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === OrderStatus.payment) {
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
                    if (status === OrderStatus.ordered) {
                        newNewOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        snackbar(OrderAdded(change.doc.data().table), { variant: 'success' });
                    } else if (status === OrderStatus.updated || status === OrderStatus.requested) {
                        newUpdatedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        snackbar(OrderUpdated(change.doc.data().table), { variant: 'info' });
                    } else if (status === OrderStatus.approved) {
                        if (differenceInMinutesFromNow(change.doc.data().serveTime) < 0) {
                            newOverdueOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        } else {
                            newCurrentOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                        }
                    } else if (status === OrderStatus.served) {
                        newServedOrders.unshift({ id: change.doc.id, ...change.doc.data() });
                    } else if (status === OrderStatus.payment) {
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
                    requests: querySnapshot.data().requests,
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
