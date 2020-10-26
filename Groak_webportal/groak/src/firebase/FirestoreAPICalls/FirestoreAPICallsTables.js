import { v4 as uuidv4 } from 'uuid';
import { db, getCurrentDateTime } from '../FirebaseLibrary';
import { createOrderReference } from './FirestoreAPICallsOrders';
import { createRequestReference } from './FirestoreAPICallsRequests';
import { TableStatus } from '../../catalog/Others';
import { DemoRequest } from '../../catalog/Demo';
import { getCurrentDateTimePlusMinutes } from '../../catalog/TimesDates';

export const createRestaurantReference = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId);
};

// export const createTableReferenceInTableCollections = (tableId) => {
//     return db.collection('tables').doc(tableId);
// };

export const createTableReferenceInRestaurantCollections = (restaurantId, tableId) => {
    return db.collection(`restaurants/${restaurantId}/tables`).doc(tableId);
};

export const fetchTablesRealtimeFirestoreAPI = (restaurantId, getTablesFunction) => {
    return db.collection(`restaurants/${restaurantId}/tables`).orderBy('created').onSnapshot(getTablesFunction);
};

export const fetchTablesFirestoreAPI = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/tables`).get();
};

export const fetchTableFirestoreAPI = (restaurantId, tableId) => {
    return db.collection(`restaurants/${restaurantId}/tables`).doc(tableId).get();
};

/**
 * This function adds table to both restaurants collection and tables collection and order and request to restaurants collection
 *
 * @param {*} restaurantId restaurant where table is being added
 * @param {*} tableId table being added
 * @param {*} data contains information about the table
 */
export const addTableFirestoreAPI = (restaurantId, restaurantName, tableId, data) => {
    const batch = db.batch();

    const tableData = {
        name: data.name,
        allowOrdering: true,
        created: getCurrentDateTime(),
        restaurantId,
        id: tableId,
        reference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        orderReference: createOrderReference(restaurantId, tableId),
        requestReference: createRequestReference(restaurantId, tableId),
        restaurantName,
        status: TableStatus.available,
        newRequest: false,
        newRequestForUser: true,
        newOrderUpdateForUser: false,
        callWaiter: false,
        callWaiterCount: 0,
        sessionIds: [],
        registrationTokensCustomers: [],
        tableAvailabilityId: uuidv4(),
        serveTime: getCurrentDateTimePlusMinutes(30),
        x: data.x,
        y: data.y,
        qrCodes: [],
        paymentMethod: 'waiter',
        tip: {
            tipValue: -1,
            tipIndex: -1,
        },
    };

    batch.set(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), tableData);

    const orderData = {
        comments: [],
        allowOrdering: true,
        dishes: [],
        items: 0,
        updated: getCurrentDateTime(),
        status: TableStatus.available,
        serveTime: getCurrentDateTimePlusMinutes(30),
        newRequest: false,
        newRequestForUser: true,
        newOrderUpdateForUser: false,
        callWaiter: false,
        callWaiterCount: 0,
        sessionIds: [],
        registrationTokensCustomers: [],
        tableAvailabilityId: uuidv4(),
        table: data.name,
        reference: createOrderReference(restaurantId, tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        tableReference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        requestReference: createRequestReference(restaurantId, tableId),
        paymentMethod: 'waiter',
        tip: {
            tipValue: -1,
            tipIndex: -1,
        },
    };

    const requestData = {
        reference: createRequestReference(restaurantId, tableId),
        requests: DemoRequest,
        restaurantReference: createRestaurantReference(restaurantId),
        restaurantName,
        sessionIds: [],
        table: data.name,
    };

    batch.set(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), orderData);
    batch.set(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId), requestData);

    return batch.commit();
};

/**
 * This function updates table from both restaurants collection and tables collection
 *
 * @param {*} restaurantId restaurant where table is being updated
 * @param {*} tableId table being updated
 */
export const updateTableFirestoreAPI = (restaurantId, tableId, data) => {
    const batch = db.batch();

    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), data);
    if (data.name && data.allowOrdering !== undefined) {
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), { table: data.name, allowOrdering: data.allowOrdering });
        batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId), { table: data.name });
    } else if (data.name) {
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), { table: data.name });
        batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId), { table: data.name });
    } else if (data.allowOrdering !== undefined) {
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), { allowOrdering: data.allowOrdering });
    }

    return batch.commit();
};

/**
 * This function deletes table from both restaurants collection and tables collection
 *
 * @param {*} restaurantId restaurant where table is being deleted
 * @param {*} tableId table being deleted
 */
export const deleteTableFirestoreAPI = (restaurantId, tableId) => {
    const batch = db.batch();

    batch.delete(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId));
    batch.delete(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId));
    batch.delete(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId));

    return batch.commit();
};
