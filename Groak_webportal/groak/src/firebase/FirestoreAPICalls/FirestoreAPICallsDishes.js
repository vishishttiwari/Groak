import { db, storageRef } from '../FirebaseLibrary';
import { createRestaurantReference } from './FirestoreAPICallsTables';
import { updateRestaurantFirestoreAPI } from './FirestoreAPICallsRestaurants';

export const createDishReference = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId);
};

export const createDishReferenceFromPath = (dishPath) => {
    return db.doc(dishPath);
};

export const fetchDishesFromCollectionFirestoreAPI = (restaurantId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).get();
};

/**
 * Fetches from restaurant document
 *
 * @param {*} restaurantId
 */
export const fetchDishesFirestoreAPI = (restaurantId) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { dishes } = restaurantDoc.data();
            return Promise.all(dishes.map(async (dish) => {
                return transaction.get(dish);
            }));
        }
        return Promise.resolve();
    });
};

export const fetchDishesSnapshotFirestoreAPI = (restaurantId, getDishesFunction) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).onSnapshot(getDishesFunction);
};

export const fetchDishesFromArrayFirestoreAPI = (dishReferences) => {
    return db.runTransaction(async (transaction) => {
        return Promise.all(dishReferences.map(async (dish) => {
            return transaction.get(dish);
        }));
    });
};

export const fetchDishFirestoreAPI = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).get();
};

/**
 * This function does much more than adding a dish. It adds the dish document
 * in the dishes colletions and also adds it to the dishes array in restaurant document
 *
 * @param {*} restaurantId restaurant for which dish needs to be added
 * @param {*} dishId dish id that needs to be added
 * @param {*} data dish data
 */
export const addDishFirestoreAPI = (restaurantId, dishId, data) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const dishRef = createDishReference(restaurantId, dishId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { dishes } = restaurantDoc.data();
            if (dishes) {
                dishes.unshift(dishRef);
                transaction.update(restaurantReference, { dishes });
            }
            transaction.set(createDishReference(restaurantId, dishId), data);
        }
    });
};

/**
 * This function does much more than adding a dish. It adds the dish document
 * in the dishes colletions and also adds it to the dishes array in restaurant document
 *
 * @param {*} restaurantId restaurant for which dish needs to be added
 * @param {*} dishId dish ids that needs to be added
 * @param {*} data dish datas
 */
export const addDishesFirestoreAPI = (restaurantId, dishIds, dishDatas) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const dishRefs = [];
    const dishRefsPaths = [];

    dishIds.forEach((dishId) => {
        dishRefs.push(createDishReference(restaurantId, dishId));
        dishRefsPaths.push(createDishReference(restaurantId, dishId).path);
    });

    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { dishes } = restaurantDoc.data();
            if (dishes) {
                dishRefs.forEach((dishRef) => {
                    dishes.unshift(dishRef);
                });
            }
            transaction.update(restaurantReference, { dishes });

            dishRefs.forEach((dishRef, index) => {
                transaction.set(dishRef, dishDatas[index]);
            });
        }
    });
};

export const updateDishFirestoreAPI = (restaurantId, dishId, data) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).update(data);
};

/**
 * This cannot be used anymore because it does not delete from restaurant document.
 *
 * This function just deletes the dish
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 */
export const justDeleteDishFirestoreAPI = (restaurantId, dishId) => {
    return db.collection(`restaurants/${restaurantId}/dishes`).doc(dishId).delete();
};

/**
 * This function does much more than deleting a dish. It deletes the dish document
 * in the dish colletions and also deletes it in the dishes array in restaurant document
 * and deletes from every table document
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteDishFirestoreAPI = (restaurantId, dishId, categories) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const dishRef = createDishReference(restaurantId, dishId);
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { dishes } = restaurantDoc.data();

            categories.forEach((doc) => {
                const category = doc.data();
                if (category.dishes) {
                    const dishes1 = category.dishes;
                    if (dishes1) {
                        const updatedDishes = dishes1.filter((dish) => {
                            if (dish.path === dishRef.path) return false;
                            return true;
                        });
                        transaction.update(category.reference, { dishes: updatedDishes });
                    }
                }
            });

            if (dishes) {
                const updatedDishes = dishes.filter((dish) => {
                    if (dish.path === dishRef.path) return false;
                    return true;
                });
                transaction.update(restaurantReference, { dishes: updatedDishes });
            }

            transaction.delete(dishRef);
        }
    });
};

export const updateDishesFromArrayFirestoreAPI = (restaurantId, dishIds, category, data) => {
    const dishRefs = [];
    const dishRefsPaths = [];
    const dishDocsData = new Map();
    dishIds.forEach((dishId) => {
        dishRefs.push(createDishReference(restaurantId, dishId));
        dishRefsPaths.push(createDishReference(restaurantId, dishId).path);
    });

    return db.runTransaction(async (transaction) => {
        await Promise.all(dishRefs.map(async (dishRef) => {
            const dishDoc = await transaction.get(dishRef);
            dishDocsData.set(dishRef.path, dishDoc.data());
        }));

        if (category === 'info') {
            dishRefs.forEach((dishRef) => {
                let newShortInfo = dishDocsData.get(dishRef.path).shortInfo;
                let newData = data;
                if (newShortInfo.length === 0) {
                    while (newData.indexOf('\n') === 0) {
                        newData = newData.substring(1, newData.length);
                    }
                }
                newShortInfo += newData;
                transaction.update(dishRef, { shortInfo: newShortInfo });
            });
        } else if (category === 'description') {
            dishRefs.forEach((dishRef) => {
                let newDescription = dishDocsData.get(dishRef.path).description;
                let newData = data;
                if (newDescription.length === 0) {
                    while (newData.indexOf('\n') === 0) {
                        newData = newData.substring(1, newData.length);
                    }
                }
                newDescription += newData;
                transaction.update(dishRef, { description: newDescription });
            });
        } else if (category === 'price') {
            dishRefs.forEach((dishRef) => {
                let newPrice = dishDocsData.get(dishRef.path).price;
                newPrice = parseFloat(data);
                transaction.update(dishRef, { price: newPrice });
            });
        } else if (category === 'restrictions') {
            dishRefs.forEach((dishRef) => {
                let newRestrictions = dishDocsData.get(dishRef.path).restrictions;
                newRestrictions = data;
                transaction.update(dishRef, { restrictions: newRestrictions });
            });
        } else if (category === 'ingredients') {
            dishRefs.forEach((dishRef) => {
                let newIngredients = dishDocsData.get(dishRef.path).ingredients;
                newIngredients = newIngredients.concat(data);
                transaction.update(dishRef, { ingredients: newIngredients });
            });
        } else if (category === 'extras') {
            dishRefs.forEach((dishRef) => {
                let newExtras = dishDocsData.get(dishRef.path).extras;
                newExtras = newExtras.concat(data);
                transaction.update(dishRef, { extras: newExtras });
            });
        }
    });
};

/**
 * Function called for deleting bulk dishIds in array
 *
 * @param {*} restaurantId
 * @param {*} dishIds
 * @param {*} categories
 */
export const deleteDishesFromArrayFirestoreAPI = (restaurantId, dishIds, categories) => {
    const restaurantReference = createRestaurantReference(restaurantId);
    const dishRefs = [];
    const dishRefsPaths = [];
    dishIds.forEach((dishId) => {
        dishRefs.push(createDishReference(restaurantId, dishId));
        dishRefsPaths.push(createDishReference(restaurantId, dishId).path);
    });
    return db.runTransaction(async (transaction) => {
        const restaurantDoc = await transaction.get(restaurantReference);
        if (restaurantDoc.exists) {
            const { dishes } = restaurantDoc.data();
            categories.forEach((doc) => {
                const category = doc.data();
                if (category.dishes) {
                    const dishes1 = category.dishes;
                    if (dishes1) {
                        const updatedDishes = dishes1.filter((dish) => {
                            if (dishRefsPaths.includes(dish.path)) return false;
                            return true;
                        });
                        transaction.update(category.reference, { dishes: updatedDishes });
                    }
                }
            });

            if (dishes) {
                const updatedDishes = dishes.filter((dish) => {
                    if (dishRefsPaths.includes(dish.path)) return false;
                    return true;
                });
                transaction.update(restaurantReference, { dishes: updatedDishes });
            }

            dishRefs.forEach((dish) => {
                transaction.delete(dish);
            });
        }
    });
};

/**
 * This cannot be used anymore because it does not delete from restaurant document.
 *
 * This function does much more than deleting a dish. It receives all the categories.
 * So it goes through each category, gets all the selected dishes, remove the specific
 * dishId from the selected dishes array that needs to be deleted. Then deletes the dish.
 * For this it uses batch writes which means that if one update is not then all of them will
 * not be done. One thing that this does not do is delete from the restaurant document so this is not used
 *
 * @param {*} restaurantId restaurant for which dish needs to be deleted
 * @param {*} dishId dish id that needs to be deleted
 * @param {*} categories all the categories in the restaurant
 */
export const deleteDishUsingBatchFirestoreAPI = (restaurantId, dishId, categories) => {
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

export const changeOrderOfDishesFirestoreAPI = (restaurantId, dishReferences) => {
    return updateRestaurantFirestoreAPI(restaurantId, { dishes: dishReferences });
};
