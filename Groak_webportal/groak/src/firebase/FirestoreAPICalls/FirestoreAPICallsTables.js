import { db, getCurrentDateTime } from '../FirebaseLibrary';
import { createOrderReference } from './FirestoreAPICallsOrders';
import { createRequestReference } from './FirestoreAPICallsRequests';
import { TableStatus } from '../../catalog/Others';
import { DemoRequest } from '../../catalog/Demo';
import { getCurrentDateTimePlusMinutes } from '../../catalog/TimesDates';

export const createRestaurantReference = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId);
};

export const createTableReferenceInTableCollections = (tableId) => {
    return db.collection('tables').doc(tableId);
};

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
export const addTableFirestoreAPI = (restaurantId, tableId, data) => {
    const batch = db.batch();

    const tableData = {
        name: data.name,
        created: getCurrentDateTime(),
        restaurantId,
        reference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        originalReference: createTableReferenceInTableCollections(tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        orderReference: createOrderReference(restaurantId, tableId),
        requestReference: createRequestReference(restaurantId, tableId),
        status: TableStatus.available,
        newRequest: false,
        serveTime: getCurrentDateTimePlusMinutes(30),
        x: data.x,
        y: data.y,
    };

    batch.set(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), tableData);
    batch.set(db.collection('tables/').doc(tableId), tableData);

    const orderData = {
        comments: [],
        dishes: [],
        items: 0,
        updated: getCurrentDateTime(),
        reference: createOrderReference(restaurantId, tableId),
        restaurantReference: createRestaurantReference(restaurantId),
        status: TableStatus.available,
        newRequest: false,
        serveTime: getCurrentDateTimePlusMinutes(30),
        table: data.name,
        tableReference: createTableReferenceInRestaurantCollections(restaurantId, tableId),
        tableOriginalReference: createTableReferenceInTableCollections(tableId),
        requestReference: createRequestReference(restaurantId, tableId),
    };

    const requestData = {
        reference: createRequestReference(restaurantId, tableId),
        requests: DemoRequest,
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
    batch.update(db.collection('tables/').doc(tableId), data);
    if (data.name) {
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), { table: data.name });
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
    batch.delete(db.collection('tables/').doc(tableId));
    batch.delete(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId));

    return batch.commit();
};
