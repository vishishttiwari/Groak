import { db, storageRef } from '../Firebase';
import { ErrorDeletingDish } from '../../catalog/NotificationsComments';

export const createDishReference = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId);
};

export const fetchDishesFirestoreAPI = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).orderBy('created').get();
};

export const fetchDishFirestoreAPI = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).get();
};

export const addDishFirestoreAPI = (restaurantId, dishId, data) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).set(data);
};

export const updateDishFirestoreAPI = (restaurantId, dishId, data) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).update(data);
};

/**
 * This function just deletes the dish
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 */
export const justDeleteDishFirestoreAPI = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).delete();
};

/**
 * This function does much more than deleting a dish. It receives all the categories.
 * So it goes through each category, gets all the selected dishes, remove the specific
 * dishId from the selected dishes array that needs to be deleted. Then deletes the dish.
 * For this it uses transactions which means that if one update is not then all of them will
 * not be done. We are using batch writes but this function also works completely.
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteDishUsingTransactionFirestoreAPI = (restaurantId, dishId, categories) => {
    return db.runTransaction((transaction) => {
        return new Promise((resolve, reject) => {
            if (!categories) {
                reject(ErrorDeletingDish);
            }
            categories.forEach((doc) => {
                const category = doc.data();
                let newSelectedDishes = [];
                if (category.dishes) {
                    // Get dishes in this category and add it to selected dishes
                    category.dishes.forEach((dish) => {
                        newSelectedDishes.push(dish.path.split('/').pop());
                    });
                    // If the dishId array contains this dishId then this loop will create another dishId array without the above Id
                    newSelectedDishes = newSelectedDishes.filter((dish) => {
                        return (dish !== dishId);
                    });
                    // This loop creates an array of dishId in terms of references
                    newSelectedDishes = newSelectedDishes.map((dish) => {
                        return createDishReference(restaurantId, dish);
                    });
                    transaction.update(category.reference, { dishes: newSelectedDishes });
                }
            });
            transaction.delete(createDishReference(restaurantId, dishId));
            resolve('Dish Deleted');
        });
    });
};

/**
 * This function does much more than deleting a dish. It receives all the categories.
 * So it goes through each category, gets all the selected dishes, remove the specific
 * dishId from the selected dishes array that needs to be deleted. Then deletes the dish.
 * For this it uses batch writes which means that if one update is not then all of them will
 * not be done.
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteDishFirestoreAPI = (restaurantId, dishId, categories) => {
    const batch = db.batch();
    if (categories) {
        categories.forEach((doc) => {
            const category = doc.data();
            let newSelectedDishes = [];
            if (category.dishes) {
            // Get dishes in this category and add it to selected dishes
                category.dishes.forEach((dish) => {
                    newSelectedDishes.push(dish.path.split('/').pop());
                });
                // If the dishId array contains this dishId then this loop will create another dishId array without the above Id
                newSelectedDishes = newSelectedDishes.filter((dish) => {
                    return (dish !== dishId);
                });
                // This loop creates an array of dishId in terms of references
                newSelectedDishes = newSelectedDishes.map((dish) => {
                    return createDishReference(restaurantId, dish);
                });
                batch.update(category.reference, { dishes: newSelectedDishes });
            }
        });
    }
    batch.delete(createDishReference(restaurantId, dishId));

    return batch.commit();
};

/**
 * This function adds image to the firestore. It first adds the image, then gets
 * the reference of the image as well. It also adds metadata with the image which
 * says the name of the dish that is being added.
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} dishName name of the dish
 * @param {*} file of the image
 */
export const addDishImageFirestoreAPI = (restaurantId, dishId, dishName, file) => {
    const metadata = {
        customMetadata: {
            DishName: dishName,
        },
    };
    const imageRef = storageRef.child(`dishes/${restaurantId}/${dishId}.png`);
    return { ref: imageRef, promise: imageRef.put(file, metadata) };
};

export const deleteDishImageFirestoreAPI = (restaurantId, dishId) => {
    const imageRef = storageRef.child(`dishes/${restaurantId}/${dishId}.png`);
    return imageRef.delete();
};

export const getDishImageURLFirestoreAPI = (ref) => {
    return ref.getDownloadURL();
};

/**
 * This changes the order of the dishes by swapping the order field of dishes.
 * A batch is used because orders of two dishes have to changed simultaneously for this to work.
 * We are not calling this function through out the project.
 *
 * @param {*} dishToBeMovedPrior dish that needs to be moved prior
 * @param {*} dishToBeMovedNext  dish that needs to be moved next
 */
export const changeOrderOfDishFirestoreAPI = (dishToBeMovedPrior, dishToBeMovedNext) => {
    const dishToBeMovedPriorOrder = dishToBeMovedPrior.order;
    const dishToBeMovedNextOrder = dishToBeMovedNext.order;

    const batch = db.batch();

    batch.update(dishToBeMovedPrior.reference, { order: dishToBeMovedNextOrder });
    batch.update(dishToBeMovedNext.reference, { order: dishToBeMovedPriorOrder });

    return batch.commit();
};
