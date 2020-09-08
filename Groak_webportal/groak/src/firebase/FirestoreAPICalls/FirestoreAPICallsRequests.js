import { db } from '../FirebaseLibrary';

export const createRequestReference = (restaurantId, requestId) => {
    return db.collection(`restaurants/${restaurantId}/requests`).doc(requestId);
};

export const fetchRequestFirestoreAPI = (restaurantId, requestId, getRequestsFunction) => {
    return db.collection(`restaurants/${restaurantId}/requests`).doc(requestId).onSnapshot(getRequestsFunction);
};

export const updateRequestFirestoreAPI = (restaurantId, requestId, data) => {
    const batch = db.batch();

    batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(requestId), data);
    batch.update(db.collection('tables').doc(requestId), { newRequest: false, newRequestForUser: true });
    batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(requestId), { newRequest: false, newRequestForUser: true });
    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(requestId), { newRequest: false, newRequestForUser: true });

    return batch.commit();
};

export const updateRequestFromUserFirestoreAPI = (restaurantId, requestId, data) => {
    const batch = db.batch();

    batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(requestId), data);
    batch.update(db.collection('tables').doc(requestId), { newRequest: true, newRequestForUser: false });
    batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(requestId), { newRequest: true, newRequestForUser: false });
    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(requestId), { newRequest: true, newRequestForUser: false });

    return batch.commit();
};

export const updateRequestFromUserWhenUserSeenMessageFirestoreAPI = (restaurantId, requestId) => {
    const batch = db.batch();

    batch.update(db.collection('tables').doc(requestId), { newRequestForUser: false });
    batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(requestId), { newRequestForUser: false });
    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(requestId), { newRequestForUser: false });

    return batch.commit();
};
