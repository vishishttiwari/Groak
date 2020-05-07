import { db, deleteField } from '../FirebaseLibrary';

export const createCategoryReference = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId);
};

export const fetchCategoriesFirestoreAPI = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).orderBy('order').get();
};

export const fetchCategoryFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).get();
};

export const addCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).set(data);
};

export const updateCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update(data);
};

/**
 * This function is used for changing the order by swapping the order field. This is done using batch writes
 * because otherwise, its possible that one change happens and the other does not and this could lead to
 * BIG problems.
 *
 * @param {*} categoryToBeMovedPrior category to be moved prior
 * @param {*} categoryToBeMovedNext category to be moved next
 */
export const changeOrderOfCategoryFirestoreAPI = (categoryToBeMovedPrior, categoryToBeMovedNext) => {
    const categoryToBeMovedPriorOrder = categoryToBeMovedPrior.order;
    const categoryToBeMovedNextOrder = categoryToBeMovedNext.order;

    const batch = db.batch();

    batch.update(categoryToBeMovedPrior.reference, { order: categoryToBeMovedNextOrder });
    batch.update(categoryToBeMovedNext.reference, { order: categoryToBeMovedPriorOrder });

    return batch.commit();
};

export const deleteCategoryFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).delete();
};

export const deleteCategoryFieldFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update({ order: deleteField });
};
