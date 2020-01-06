import { db, createGeoPoint, storageRef } from '../Firebase';
import { randomNumber } from '../../catalog/Others';
import { createDemoDish, createDemoCategory, createDemoTable, createDemoOrder, createDemoRequest } from '../../catalog/Demo';

export const createRestaurantReference = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId);
};

/**
 * This function adds image to the firestore. It first adds the image, then gets
 * the reference of the image as well. It also adds metadata with the image which
 * says the name of the restaurant that is being added.
 *
 * @param {*} restaurantId restaurant for which logo needs to be deleted
 * @param {*} restaurantName name of the restaurant
 * @param {*} file of the image
 */
export const addRestaurantLogoFirestoreAPI = (restaurantId, restaurantName, file) => {
    const metadata = {
        customMetadata: {
            RestaurantId: restaurantId,
            RestaurantName: restaurantName,
        },
    };
    const imageRef = storageRef.child(`restaurants/${restaurantId}/logo.png`);
    return { ref: imageRef, promise: imageRef.put(file, metadata) };
};

export const getRestaurantLogoURLFirestoreAPI = (ref) => {
    return ref.getDownloadURL();
};

export const fetchRestaurantFirestoreAPI = (restaurantId) => {
    return db.collection('restaurants').doc(restaurantId).get();
};

export const updateRestaurantFirestoreAPI = (restaurantId, data) => {
    return db.collection('restaurants').doc(restaurantId).update(data);
};

/**
 * This function adds demo data like demo dish and demo category whenever a restaurant is created.
 *
 * @param {*} restaurantId id of the restaurant for which this is being created
 * @param {*} data this contains data about the restaurant
 */
export const addRestaurantFirestoreAPI = (restaurantId, data) => {
    const batch = db.batch();
    const dishId = randomNumber();
    const categoryId = randomNumber();
    const tableId = randomNumber();

    const newData = { ...data, location: createGeoPoint(data.address.latitude, data.address.longitude) };

    batch.set(db.collection('restaurants/').doc(restaurantId), newData);
    batch.set(db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId), createDemoDish(restaurantId, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId), createDemoCategory(restaurantId, categoryId, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), createDemoTable(restaurantId, tableId));
    batch.set(db.collection('tables/').doc(tableId), createDemoTable(restaurantId, tableId));
    batch.set(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), createDemoOrder(restaurantId, tableId, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId), createDemoRequest(restaurantId, tableId));

    return batch.commit();
};
