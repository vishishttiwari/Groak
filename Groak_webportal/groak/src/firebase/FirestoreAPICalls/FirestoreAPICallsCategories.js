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
        if (restaurantDoc.exists) {
            const { categories } = restaurantDoc.data();
            return Promise.all(categories.map(async (category) => {
                return transaction.get(category);
            }));
        }
        return Promise.resolve();
    });
};

export const fetchCategoriesFromArrayFirestoreAPI = (categoryReferences) => {
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
 * @param {*} restaurantId restaurant for which dish needs to be added
 * @param {*} categoryId category id that needs to be added
 * @param {*} data category data
 */
export const addCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const categoryRef = createCategoryReference(restaurantId, categoryId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { categories } = restaurantDoc.data();
            if (categories) {
                categories.unshift(categoryRef);
                transaction.update(restaurantReference, { categories });
            }
            transaction.set(createCategoryReference(restaurantId, categoryId), data);
        }
    });
};

/**
 * This function does much more than adding categories. It adds the category document
 * in the categories colletions and also adds it to the categories array in restaurant document
 *
 * @param {*} restaurantId restaurant for which dish needs to be added
 * @param {*} categoryIds category ids that needs to be added
 * @param {*} categoryDatas category datas
 */
export const addCategoriesFirestoreAPI = (restaurantId, categoryIds, categoryDatas) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const categoryRefs = [];
    const categoryRefsPaths = [];

    categoryIds.forEach((categoryId) => {
        categoryRefs.push(createCategoryReference(restaurantId, categoryId));
        categoryRefsPaths.push(createCategoryReference(restaurantId, categoryId).path);
    });

    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { categories } = restaurantDoc.data();
            if (categories) {
                categoryRefs.forEach((categoryRef) => {
                    categories.unshift(categoryRef);
                });
            }
            transaction.update(restaurantReference, { categories });

            categoryRefs.forEach((dishRef, index) => {
                transaction.set(dishRef, categoryDatas[index]);
            });
        }
    });
};

export const updateCategoryFirestoreAPI = (restaurantId, categoryId, data) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update(data);
};

export const updateCategoriesFromArrayFirestoreAPI = (restaurantId, categoryIds, category, data) => {
    const categoryRefs = [];
    const categoryRefsPaths = [];
    const categoryDocsData = new Map();
    categoryIds.forEach((categoryId) => {
        categoryRefs.push(createCategoryReference(restaurantId, categoryId));
        categoryRefsPaths.push(createCategoryReference(restaurantId, categoryId).path);
    });

    return db.runTransaction(async (transaction) => {
        await Promise.all(categoryRefs.map(async (categoryRef) => {
            const categoryDoc = await transaction.get(categoryRef);
            categoryDocsData.set(categoryRef.path, categoryDoc.data());
        }));

        if (category === 'days') {
            const newDays = [];
            Object.keys(data.days).forEach((day) => {
                if (data.days[day]) {
                    newDays.push(day);
                }
            });
            categoryRefs.forEach((categoryRef) => {
                transaction.update(categoryRef, { startTime: data.startTime, endTime: data.endTime, days: newDays });
            });
        }
    });
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
        if (restaurantDoc.exists) {
            const { categories } = restaurantDoc.data();

            qrCodes.forEach((doc) => {
                const qrCode = doc.data();
                if (qrCode.categories) {
                    const categories1 = qrCode.categories;
                    if (categories1) {
                        const updatedCategories = categories1.filter((category) => {
                            if (category.path === categoryRef.path) return false;
                            return true;
                        });
                        transaction.update(qrCode.reference, { categories: updatedCategories });
                    }
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
        }
    });
};

/**
 * Function called for deleting bulk categoryIds in array
 *
 * @param {*} restaurantId
 * @param {*} categoryIds
 * @param {*} categories
 */
export const deleteCategoriesFromArrayFirestoreAPI = (restaurantId, categoryIds, qrCodes) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const categoryRefs = [];
    const categoryRefsPaths = [];
    categoryIds.forEach((categoryId) => {
        categoryRefs.push(createCategoryReference(restaurantId, categoryId));
        categoryRefsPaths.push(createCategoryReference(restaurantId, categoryId).path);
    });
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { categories } = restaurantDoc.data();
            qrCodes.forEach((doc) => {
                const qrCode = doc.data();
                if (qrCode.categories) {
                    const categories1 = qrCode.categories;
                    if (categories1) {
                        const updatedCategories = categories1.filter((category) => {
                            if (categoryRefsPaths.includes(category.path)) return false;
                            return true;
                        });
                        transaction.update(qrCode.reference, { categories: updatedCategories });
                    }
                }
            });

            if (categories) {
                const updatedCategories = categories.filter((category) => {
                    if (categoryRefsPaths.includes(category.path)) return false;
                    return true;
                });
                transaction.update(restaurantReference, { categories: updatedCategories });
            }

            categoryRefs.forEach((category) => {
                transaction.delete(category);
            });
        }
    });
};

export const deleteCategoryFieldFirestoreAPI = (restaurantId, categoryId) => {
    return db.collection(`restaurants/${restaurantId}/categories`).doc(categoryId).update({ order: deleteField });
};
