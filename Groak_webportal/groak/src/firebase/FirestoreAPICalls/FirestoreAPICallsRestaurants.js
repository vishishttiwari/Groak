import { db, storageRef } from '../FirebaseLibrary';
import { randomNumber } from '../../catalog/Others';
import { createDemoDish, createDemoCategory, createDemoTable, createDemoOrder, createDemoRequest, createDemoQRCode, createDemoRestaurant } from '../../catalog/Demo';

/**
 * This function creates a restaurant reference
 *
 * @param {*} restaurantId id of the restaurant where the demo needs to be added
 */
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

/**
 * This function adds image to the firestore. It first adds the image, then gets
 * the reference of the image as well. It also adds metadata with the image which
 * says the name of the restaurant that is being added.
 *
 * @param {*} restaurantId restaurant for which logo needs to be deleted
 * @param {*} restaurantName name of the restaurant
 * @param {*} file of the image
 */
export const addRestaurantImageFirestoreAPI = (restaurantId, restaurantName, file) => {
    const metadata = {
        customMetadata: {
            RestaurantId: restaurantId,
            RestaurantName: restaurantName,
        },
    };
    const refImage = storageRef.child(`restaurants/${restaurantId}/image.png`);
    return { refImage, promiseImage: refImage.put(file, metadata) };
};

export const getRestaurantLogoURLFirestoreAPI = (ref) => {
    return ref.getDownloadURL();
};

export const getRestaurantImageURLFirestoreAPI = (ref) => {
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
 * @param {*} restaurantName name of the restaurant to be added
 * @param {*} data this contains data about the restaurant
 */
export const addRestaurantFirestoreAPI = (restaurantId, restaurantName, address) => {
    const batch = db.batch();
    const dishId = randomNumber();
    const categoryId = randomNumber();
    const tableId = randomNumber();
    const qrCodeId = randomNumber();

    batch.set(db.collection('restaurants/').doc(restaurantId), createDemoRestaurant(restaurantId, restaurantName, address, qrCodeId, dishId, categoryId));
    batch.set(db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId), createDemoDish(restaurantId, restaurantName, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId), createDemoCategory(restaurantId, restaurantName, categoryId, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/tables`).doc(tableId), createDemoTable(restaurantId, restaurantName, tableId, qrCodeId));
    // batch.set(db.collection('tables/').doc(tableId), createDemoTable(restaurantId, restaurantName, tableId, qrCodeId));
    batch.set(db.collection(`restaurants/${restaurantId}/orders`).doc(tableId), createDemoOrder(restaurantId, restaurantName, tableId, dishId));
    batch.set(db.collection(`restaurants/${restaurantId}/requests`).doc(tableId), createDemoRequest(restaurantId, restaurantName, tableId));
    batch.set(db.collection(`restaurants/${restaurantId}/qrcodes`).doc(qrCodeId), createDemoQRCode(restaurantId, restaurantName, qrCodeId, categoryId));

    return batch.commit();
};

export const addRegistrationTokenFirestoreAPI = (restaurantId, registrationToken) => {
    if (restaurantId === undefined || restaurantId === null || restaurantId.length <= 0) {
        return null;
    }
    const restaurantReference = createRestaurantReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { registrationTokens } = restaurantDoc.data();
            if (registrationTokens === undefined || registrationTokens === null) {
                transaction.update(restaurantReference, { registrationTokens: [registrationToken] });
            } else {
                let newRegistrationTokens = registrationTokens;
                if (!registrationTokens.includes(registrationToken)
                && registrationToken !== undefined
                && registrationToken !== null
                && registrationToken.length > 0) {
                    newRegistrationTokens.unshift(registrationToken);
                }
                newRegistrationTokens = newRegistrationTokens.slice(0, 10);
                transaction.update(restaurantReference, { registrationTokens: newRegistrationTokens });
            }
        }
    });
};

export const removeRegistrationTokenFirestoreAPI = (restaurantId, registrationToken) => {
    if (restaurantId === undefined || restaurantId === null || restaurantId.length <= 0) {
        return null;
    }
    const restaurantReference = createRestaurantReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { registrationTokens } = restaurantDoc.data();
            if (registrationTokens === undefined || registrationTokens === null) {
                transaction.update(restaurantReference, { registrationTokens: [] });
            } else {
                const newRegistrationTokens = registrationTokens.filter((token) => {
                    return registrationToken !== token;
                });
                transaction.update(restaurantReference, { registrationTokens: newRegistrationTokens });
            }
        }
    });
};
