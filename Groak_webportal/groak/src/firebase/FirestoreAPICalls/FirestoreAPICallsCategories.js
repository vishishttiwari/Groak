import { db, deleteField } from '../FirebaseLibrary';
import { createRestaurantReference, updateRestaurantFirestoreAPI } from './FirestoreAPICallsRestaurants';

export const createCategoryReference = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId);
};

export const createCategoryReferenceFromPath = (categoryPath) => {
    return db.doc(categoryPath);
};

export const fetchCategoriesFromCollectionFirestoreAPI = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).get();
};

/**
 * Fetches from restaurant document
 *
 * @param {*} restaurantId
 */
export const fetchCategoriesFirestoreAPI = (restaurantId) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { categories } = restaurantDoc.data();
        return Promise.all(categories.map(async (category) => {
            return transaction.get(category);
        }));
    });
};

export const fetchCategoriesInArrayFirestoreAPI = (categoryReferences) => {
    return db.runTransaction(async (transaction) => {
        return Promise.all(categoryReferences.map(async (category) => {
            return transaction.get(category);
        }));
    });
};

export const fetchCategoryFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).get();
};

/**
 * This function does much more than adding a category. It adds the category document
 * in the categories colletions and also adds it to the categories array in restaurant document
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} categoryId category id that needs to be deleted
 * @param {*} data category data
 */
export const addCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const categoryRef = createCategoryReference(restaurantId, categoryId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { categories } = restaurantDoc.data();
        if (categories) {
            categories.push(categoryRef);
            transaction.update(restaurantReference, { categories });
        }
        transaction.set(createCategoryReference(restaurantId, categoryId), data);
    });
};

export const updateCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update(data);
};

export const changeOrderOfDishesFirestoreAPI = (restaurantId, categoryReferences) => {
    return updateRestaurantFirestoreAPI(restaurantId, { categories: categoryReferences });
};

/**
 * This function does much more than deleting a category. It deletes the category document
 * in the categories colletions and also deletes it in the categories array in restaurant document
 * and deletes from every table document
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteCategoryFirestoreAPI = (restaurantId, categoryId, qrCodes) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const categoryRef = createCategoryReference(restaurantId, categoryId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        const { categories } = restaurantDoc.data();

        qrCodes.forEach((doc) => {
            const qrCode = doc.data();
            if (qrCode.categories) {
                transaction.get(qrCode.reference).then((qrCodeDoc) => {
                    const categories1 = qrCodeDoc.data().categories;
                    if (categories1) {
                        const updatedCategories = categories1.filter((category) => {
                            if (category.path === categoryRef.path) return false;
                            return true;
                        });
                        transaction.update(qrCode.reference, { categories: updatedCategories });
                    }
                });
            }
        });

        if (categories) {
            const updatedCategories = categories.filter((category) => {
                if (category.path === categoryRef.path) return false;
                return true;
            });
            transaction.update(restaurantReference, { categories: updatedCategories });
        }

        transaction.delete(categoryRef);
    });
};

export const deleteCategoryFieldFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update({ order: deleteField });
};
