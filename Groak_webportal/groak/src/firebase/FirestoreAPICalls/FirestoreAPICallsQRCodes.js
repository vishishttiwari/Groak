import { db } from '../FirebaseLibrary';
import { createRestaurantReference, updateRestaurantFirestoreAPI } from './FirestoreAPICallsRestaurants';

export const createQRCodeReferenceFromPath = (qrCodePath) => {
    return db.doc(qrCodePath);
};

export const createQRCodeReference = (restaurantId, qrCodeId) => {
    return db.collection(`restaurants/${restaurantId}/qrcodes`).doc(qrCodeId);
};

export const fetchQRCodesFirestoreAPI = (restaurantId) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { qrCodes } = restaurantDoc.data();
        const qrCodeItems = new Array(qrCodes.length);
        Promise.allSettled(qrCodes.map(async (qrCode, index) => {
            qrCodeItems[index] = await transaction.get(qrCode).then((qrCodeDoc) => {
                return qrCodeDoc;
            });
        }));
        return qrCodeItems;
    });
};

export const fetchQRCodeFirestoreAPI = (restaurantId, qrCodeId) => {
    return db.collection(`restaurants/${restaurantId}/qrcodes`).doc(qrCodeId).get();
};

export const updateQRCodeFirestoreAPI = (restaurantId, qrCodeId, data) => {
    return db.collection(`restaurants/${restaurantId}/qrcodes`).doc(qrCodeId).update(data);
};

export const changeOrderOfQRCodesFirestoreAPI = (restaurantId, qrCodeReferences) => {
    return updateRestaurantFirestoreAPI(restaurantId, { qrCodes: qrCodeReferences });
};

/**
 * This function does much more than adding a qrcode. It adds the qr code document
 * in the qrcode colletions and also adds it to the qrcode array in restaurant document
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const addQRCodeFirestoreAPI = (restaurantId, qrCodeId, data) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const qrCodeRef = createQRCodeReference(restaurantId, qrCodeId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { qrCodes } = restaurantDoc.data();
        if (qrCodes) {
            qrCodes.push(qrCodeRef);
            transaction.update(restaurantReference, { qrCodes });
        }
        transaction.set(createQRCodeReference(restaurantId, qrCodeId), data);
    });
};

/**
 * This function does much more than deleting a qrcode. It deletes the qr code document
 * in the qrcode colletions and also deletes it in the qrcode array in restaurant document
 * and deletes from every table document
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteQRCodeFirestoreAPI = (restaurantId, qrCodeId, tables) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const qrCodeRef = createQRCodeReference(restaurantId, qrCodeId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { qrCodes } = restaurantDoc.data();
        if (qrCodes) {
            const updatedQRCodes = qrCodes.filter((qrCode) => {
                if (qrCode.path === qrCodeRef.path) return false;
                return true;
            });
            transaction.update(restaurantReference, { qrCodes: updatedQRCodes });
        }

        tables.forEach((doc) => {
            const table = doc.data();
            if (table.qrcodes) {
                transaction.get(table.reference).then((tableDoc) => {
                    const qrCodes1 = tableDoc.data().qrcodes;
                    if (qrCodes1) {
                        const updatedQRCodes = qrCodes1.filter((qrCode) => {
                            if (qrCode.path === qrCodeRef.path) return false;
                            return true;
                        });
                        transaction.update(table.reference, { qrcodes: updatedQRCodes });
                    }
                });
            }
        });

        transaction.delete(qrCodeRef);
    });
};
