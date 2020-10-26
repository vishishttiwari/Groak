import { v4 as uuidv4 } from 'uuid';
import { db, fetchRegistrationToken, getCurrentDateTime } from '../FirebaseLibrary';
import { TableStatus } from '../../catalog/Others';
import { DemoRequest } from '../../catalog/Demo';
import { createDishReference } from './FirestoreAPICallsDishes';
import { createTableReferenceInRestaurantCollections } from './FirestoreAPICallsTables';
import { getCurrentDateTimePlusMinutes } from '../../catalog/TimesDates';
import { saveOrder } from '../../catalog/LocalStorage';
import { createRequestReference } from './FirestoreAPICallsRequests';

export const createOrderReference = (restaurantId, orderId) => {
    return db.collection(`restaurants/${restaurantId}/orders`).doc(orderId);
};

export const fetchOrdersFirestoreAPI = (restaurantId, getOrdersFunction) => {
    return db.collection(`restaurants/${restaurantId}/orders`).orderBy('updated').onSnapshot(getOrdersFunction);
};

export const fetchOrderFirestoreAPI = (restaurantId, orderId, getOrderFunction) => {
    return db.collection(`restaurants/${restaurantId}/orders`).doc(orderId).onSnapshot(getOrderFunction);
};

export const updateOrderFirestoreAPI = (restaurantId, orderId, data) => {
    const batch = db.batch();

    if (data.status === TableStatus.available) {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status:
        data.status,
        newRequest: false,
        newRequestForUser: true,
        newOrderUpdateForUser: false,
        callWaiter: false,
        sessionIds: [],
        registrationTokensCustomers: [],
        tableAvailabilityId: uuidv4() });
        const newData = { ...data,
            updated: getCurrentDateTime(),
            comments: [],
            dishes: [],
            items: 0,
            newRequest: false,
            newRequestForUser: true,
            newOrderUpdateForUser: false,
            callWaiter: false,
            callWaiterCount: 0,
            sessionIds: [],
            registrationTokensCustomers: [],
            tableAvailabilityId: uuidv4() };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
        batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(orderId), { requests: DemoRequest, sessionIds: [], registrationTokensCustomers: [] });
    } else if (data.status === TableStatus.approved) {
        if (data.serveTime) {
            batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status, serveTime: data.serveTime, newOrderUpdateForUser: true });
        } else {
            batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status, newOrderUpdateForUser: true });
        }
        const newData = { ...data, updated: getCurrentDateTime(), newOrderUpdateForUser: true };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    } else if (data.status === TableStatus.served || data.status === TableStatus.payment) {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status, newOrderUpdateForUser: true });
        const newData = { ...data, updated: getCurrentDateTime(), newOrderUpdateForUser: true };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    } else {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status });
        const newData = { ...data, updated: getCurrentDateTime() };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    }

    return batch.commit();
};

export const addOrderFirestoreAPI = (restaurantId, orderId, cart, comment) => {
    const finalCart = [];
    const finalItemIds = [];
    cart.forEach((item) => {
        const reference = uuidv4();
        finalCart.push({
            name: item.name,
            reference,
            dishReference: createDishReference(restaurantId, item.dishId),
            price: item.price,
            quantity: item.quantity,
            extras: item.extras,
            created: getCurrentDateTime(),
        });
        finalItemIds.push(reference);
    });

    let finalComment = {};
    if (comment && comment.length > 0) {
        const finalCommentId = uuidv4();
        finalComment = {
            comment,
            reference: finalCommentId,
            created: getCurrentDateTime(),
        };
        finalItemIds.push(finalCommentId);
    }

    saveOrder(restaurantId, finalItemIds);

    const orderReference = createOrderReference(restaurantId, orderId);
    const tableReference = createTableReferenceInRestaurantCollections(restaurantId, orderId);

    return db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderReference);
        if (orderDoc.exists) {
            const { dishes, comments, status } = orderDoc.data();
            if (dishes) {
                finalCart.forEach((dish) => {
                    dishes.push(dish);
                });
            }
            const updated = getCurrentDateTime();
            const items = dishes.length;
            if (comment && comment.length > 0) {
                if (comments) {
                    comments.push(finalComment);
                }
                if (status === TableStatus.seated || status === TableStatus.available) {
                    transaction.update(orderReference, { dishes, comments, status: TableStatus.ordered, updated, items, serveTime: getCurrentDateTimePlusMinutes(30) });
                } else {
                    transaction.update(orderReference, { dishes, comments, status: TableStatus.ordered, updated, items });
                }
            } else if (status === TableStatus.seated || status === TableStatus.available) {
                transaction.update(orderReference, { dishes, status: TableStatus.ordered, updated, items, serveTime: getCurrentDateTimePlusMinutes(30) });
            } else {
                transaction.update(orderReference, { dishes, status: TableStatus.ordered, updated, items });
            }

            transaction.update(tableReference, { status: TableStatus.ordered });
        }
    });
};

export const addCommentFirestoreAPI = (restaurantId, orderId, comment) => {
    const finalItemIds = [];
    const finalCommentId = uuidv4();
    const finalComment = {
        comment,
        reference: finalCommentId,
        created: getCurrentDateTime(),
    };
    finalItemIds.push(finalCommentId);

    saveOrder(restaurantId, finalItemIds);

    const orderReference = createOrderReference(restaurantId, orderId);
    const tableReference = createTableReferenceInRestaurantCollections(restaurantId, orderId);

    return db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderReference);
        if (orderDoc.exists) {
            const { comments } = orderDoc.data();

            const updated = getCurrentDateTime();
            if (comments) {
                comments.push(finalComment);
            }
            transaction.update(orderReference, { comments, status: TableStatus.ordered, updated });

            transaction.update(tableReference, { status: TableStatus.ordered });
        }
    });
};

export const updateOrderFromUserFirestoreAPI = (restaurantId, orderId, newStatus, tip, paymentMethod) => {
    const orderReference = createOrderReference(restaurantId, orderId);
    const requestReference = createRequestReference(restaurantId, orderId);
    const tableReference = createTableReferenceInRestaurantCollections(restaurantId, orderId);

    return db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderReference);
        if (orderDoc.exists) {
            const { status, registrationTokensCustomers } = orderDoc.data();

            if (status === TableStatus.available && newStatus === TableStatus.seated) {
                const token = fetchRegistrationToken();
                if (registrationTokensCustomers !== undefined && registrationTokensCustomers !== null) {
                    const newRegistrationTokensCustomers = [...registrationTokensCustomers];
                    if (token !== undefined && token !== null && token.length > 0 && !newRegistrationTokensCustomers.includes(token)) {
                        newRegistrationTokensCustomers.unshift(token);
                    }
                    transaction.update(tableReference, { status: newStatus, registrationTokensCustomers: newRegistrationTokensCustomers });
                    transaction.update(orderReference, { status: newStatus, registrationTokensCustomers: newRegistrationTokensCustomers });
                    transaction.update(requestReference, { registrationTokensCustomers: newRegistrationTokensCustomers });
                } else if (token !== undefined && token !== null && token.length > 0) {
                    transaction.update(tableReference, { status: newStatus, registrationTokensCustomers: [token] });
                    transaction.update(orderReference, { status: newStatus, registrationTokensCustomers: [token] });
                    transaction.update(requestReference, { registrationTokensCustomers: [token] });
                } else {
                    transaction.update(tableReference, { status: newStatus, registrationTokensCustomers: [] });
                    transaction.update(orderReference, { status: newStatus, registrationTokensCustomers: [] });
                    transaction.update(requestReference, { registrationTokensCustomers: [] });
                }
            } else if (status !== TableStatus.available && newStatus === TableStatus.seated) {
                const token = fetchRegistrationToken();
                if (registrationTokensCustomers !== undefined && registrationTokensCustomers !== null) {
                    const newRegistrationTokensCustomers = [...registrationTokensCustomers];
                    if (token !== undefined && token !== null && token.length > 0 && !newRegistrationTokensCustomers.includes(token)) {
                        newRegistrationTokensCustomers.unshift(token);
                    }
                    transaction.update(tableReference, { registrationTokensCustomers: newRegistrationTokensCustomers });
                    transaction.update(orderReference, { registrationTokensCustomers: newRegistrationTokensCustomers });
                    transaction.update(requestReference, { registrationTokensCustomers: newRegistrationTokensCustomers });
                } else if (token !== undefined && token !== null && token.length > 0) {
                    transaction.update(tableReference, { registrationTokensCustomers: [token] });
                    transaction.update(orderReference, { registrationTokensCustomers: [token] });
                    transaction.update(requestReference, { registrationTokensCustomers: [token] });
                } else {
                    transaction.update(tableReference, { registrationTokensCustomers: [] });
                    transaction.update(orderReference, { registrationTokensCustomers: [] });
                    transaction.update(requestReference, { registrationTokensCustomers: [] });
                }
            } else if (status !== TableStatus.payment && newStatus === TableStatus.payment) {
                transaction.update(tableReference, { status: newStatus, tip, paymentMethod });
                transaction.update(orderReference, { status: newStatus, tip, paymentMethod });
            }
        }
    });
};

export const updateOrderFromUserWhenUserSeenOrderFirestoreAPI = (restaurantId, orderId) => {
    const batch = db.batch();

    batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), { newOrderUpdateForUser: false });
    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { newOrderUpdateForUser: false });

    return batch.commit();
};

export const updateOrderWhenWaiterIsCalledFirestoreAPI = (restaurantId, orderId, callWaiterNew) => {
    const orderReference = createOrderReference(restaurantId, orderId);
    const tableReference = createTableReferenceInRestaurantCollections(restaurantId, orderId);

    return db.runTransaction(async (transaction) => {
        const orderDoc = await transaction.get(orderReference);
        if (orderDoc.exists) {
            const { callWaiterCount } = orderDoc.data();

            if (callWaiterNew) {
                transaction.update(tableReference, { callWaiter: callWaiterNew, callWaiterCount: callWaiterCount + 1 });
                transaction.update(orderReference, { callWaiter: callWaiterNew, callWaiterCount: callWaiterCount + 1 });
            } else {
                transaction.update(tableReference, { callWaiter: callWaiterNew });
                transaction.update(orderReference, { callWaiter: callWaiterNew });
            }
        }
    });
};
