import { db, getCurrentDateTime } from '../Firebase';
import { TableStatus } from '../../catalog/Others';

export const createOrderReference = (restaurantId, orderId) => {
    return db.collection(`restaurants/${restaurantId}/orders`).doc(orderId);
};

export const fetchOrdersFirestoreAPI = (restaurantId, getOrdersFunction) => {
    return db.collection(`restaurants/${restaurantId}/orders`).orderBy('updated', 'desc').onSnapshot(getOrdersFunction);
};

export const fetchOrderFirestoreAPI = (restaurantId, orderId, getOrderFunction) => {
    return db.collection(`restaurants/${restaurantId}/orders`).doc(orderId).onSnapshot(getOrderFunction);
};

export const updateOrderFirestoreAPI = (restaurantId, orderId, data) => {
    const batch = db.batch();

    if (data.status === TableStatus.available) {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status });
        batch.update(db.collection('tables').doc(orderId), { status: data.status });
        const newData = { ...data, updated: getCurrentDateTime(), comments: [], dishes: [], items: 0 };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    } else if (data.status === TableStatus.approved) {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status, serveTime: data.serveTime });
        batch.update(db.collection('tables').doc(orderId), { status: data.status, serveTime: data.serveTime });
        const newData = { ...data, updated: getCurrentDateTime() };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    } else if (data.status === TableStatus.served || data.status === TableStatus.payment) {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status });
        batch.update(db.collection('tables').doc(orderId), { status: data.status });
        const newData = { ...data, updated: getCurrentDateTime() };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    } else {
        batch.update(db.collection(`restaurants/${restaurantId}/tables`).doc(orderId), { status: data.status });
        batch.update(db.collection('tables').doc(orderId), { status: data.status });
        const newData = { ...data, updated: getCurrentDateTime() };
        batch.update(db.collection(`restaurants/${restaurantId}/orders`).doc(orderId), newData);
    }

    return batch.commit();
};
