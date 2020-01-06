import { db } from '../Firebase';
import { TableStatus } from '../../catalog/Others';

export const createRequestReference = (restaurantId, requestId) => {
    return db.collection(`restaurants/${restaurantId}/requests`).doc(requestId);
};

export const fetchRequestFirestoreAPI = (restaurantId, requestId, getRequestsFunction) => {
    return db.collection(`restaurants/${restaurantId}/requests`).doc(requestId).onSnapshot(getRequestsFunction);
};

export const updateRequestFirestoreAPI = (restaurantId, requestId, data) => {
    const batch = db.batch();

    batch.update(db.collection(`restaurants/${restaurantId}/requests`).doc(requestId), data);
    batch.update(db.collection('tables').doc(requestId), { status: TableStatus.approved });
    batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(requestId), { status: TableStatus.approved });
    batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(requestId), { status: TableStatus.approved });

    return batch.commit();
};