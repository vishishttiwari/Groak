import { db, getCurrentDateTime } from '../Firebase';
import { createOrderReference } from './FirestoreAPICallsOrders';
import { OrderStatus } from '../../catalog/Others';

export const createRestaurantReference = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId);
};

export const createTableReferenceInTableCollections = (tableId) => {
    return db.collection('tables').doc(tableId);
};

export const createTableReferenceInRestaurantCollections = (restaurantId, tableId) => {
    return db.collection(`restaurants/${restaurantId}/tables`).doc(tableId);
};

export const fetchTablesFirestoreAPI = (restaurantId, getTablesFunction) => {
    return db.collection(`restaurants/${restaurantId}/tables`).orderBy('created').onSnapshot(getTablesFunction);
};

export const fetchTableFirestoreAPI = (restaurantId, tableId) => {
    return db.collection(`restaurants/${restaurantId}/tables`).doc(tableId).get();
};

/**
 * This function adds table to both restaurants collection and tables collection
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
        status: OrderStatus.available,
        x: data.x,
        y: data.y,
    };

    batch.set(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), tableData);
    batch.set(db.collection('tables/').doc(tableId), tableData);

    const restaurantData = {
        comments: [],
        dishes: [],
        requests: [],
        items: 0,
        updated: getCurrentDateTime(),
        reference: createOrderReference(restaurantId, tableId),
        restaurantReference: db.collection('restaurants').doc(restaurantId),
        status: OrderStatus.available,
        table: data.name,
        tableReference: createTableReferenceInTableCollections(tableId),
    };

    batch.set(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), restaurantData);

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
