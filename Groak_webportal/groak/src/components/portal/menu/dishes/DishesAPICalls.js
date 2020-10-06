/**
 * This class includes dishes related functions such as fetching all dishes and changing the availability of dish
 */
import { fetchDishesFirestoreAPI, addDishImageFirestoreAPI, getDishImageURLFirestoreAPI, updateDishFirestoreAPI, changeOrderOfDishesFirestoreAPI, createDishReference, addDishFirestoreAPI, deleteDishesFromArrayFirestoreAPI, updateDishesFromArrayFirestoreAPI, fetchDishesSnapshotFirestoreAPI, addDishesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { DishUpdated, ErrorFetchingDishes, ErrorChangingAvailability, DishOrderChanged, ErrorChangingDishOrder, ErrorUpdatingDish, DishAdded, ErrorAddingDish, ErrorUnsubscribingDishes, DishesDeleted, DishesUpdated, DishesAdded, ErrorUpdatingDishes, ErrorDeletingDishes, ErrorAddingDishes } from '../../../../catalog/NotificationsComments';
import { randomNumber } from '../../../../catalog/Others';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsTables';
import { getCurrentDateTime } from '../../../../firebase/FirebaseLibrary';
import { fetchCategoriesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';

let dishesSnapshot;

/**
 * This function is used for unsubscribing from realtime updates of orders
 *
 * @param {*} snackbar used for notifications
 */
export const unsubscribeFetchDishesAPI = (snackbar) => {
    try {
        if (dishesSnapshot) {
            dishesSnapshot();
        }
    } catch (error) {
        snackbar(ErrorUnsubscribingDishes, { variant: 'error' });
    }
};

/**
 * This is used for fetching the dishes
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the dishes array
 * @param {*} snackbar used for notifications
 */
export const fetchDishesAPI = async (restaurantId, setState, snackbar) => {
    const newDishes = [];
    try {
        const docs = await fetchDishesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            if (doc.exists) {
                newDishes.push({ id: doc.id, ...doc.data() });
            }
        });
        setState({ type: 'fetchDishes', dishes: newDishes });
    } catch (error) {
        snackbar(ErrorFetchingDishes, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for fetching orders
 *
 * @param {*} restaurantId id of the restaurant for which orders needs to be fetched
 * @param {*} state contains all the orders
 * @param {*} setState used for setting the order
 * @param {*} snackbar used for notifications
 */
export const fetchDishesSnapshotAPI = async (restaurantId, setState, snackbar) => {
    let newDishes = [];
    try {
        const getOrders = (querySnapshot) => {
            querySnapshot.docChanges().forEach((change) => {
                if (change.type === 'added') {
                    if (change.doc.exists) {
                        newDishes.push({ id: change.doc.id, ...change.doc.data() });
                    }
                } else if (change.type === 'modified') {
                    if (change.doc.exists) {
                        newDishes = newDishes.map((order) => {
                            if (order.id !== change.doc.id) {
                                return order;
                            }
                            return { ...change.doc.data() };
                        });
                    }
                }
            });
            setState({ type: 'fetchDishes', dishes: newDishes });
        };
        dishesSnapshot = await fetchDishesSnapshotFirestoreAPI(restaurantId, getOrders);
    } catch (error) {
        snackbar(ErrorFetchingDishes, { variant: 'error' });
        setState({ type: 'error' });
        unsubscribeFetchDishesAPI(snackbar);
    }
};

/**
 * This is used for changing the availabilty of the dishes
 *
 * @param {*} dishes dishes array
 * @param {*} setState this is used for setting the dishes array
 * @param {*} changedDish this is the dish for which the availability is being changed
 * @param {*} snackbar used for notifications
 */
export const changeAvailabilityOfDishAPI = async (restaurantId, dishes, setState, changedDish, snackbar) => {
    try {
        await updateDishFirestoreAPI(restaurantId, changedDish.id, { available: changedDish.available });
        setState({
            type: 'setDishes',
            dishes: dishes.map((dish) => {
                if (dish.id !== changedDish.id) { return dish; }
                return changedDish;
            }),
        });
        snackbar(DishUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingAvailability, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used to get 320x240 image url from the original image. This is the image that will be
 * used in the future.
 *
 * @param {*} url this contains the original url
 */
function convertURLTo320x240(url) {
    return `${url.slice(0, url.indexOf('.png?'))}_320x240${url.slice(url.indexOf('.png?'), url.length)}`;
}

/**
 * This function saves the image on cloud firebase storage. It also saves the resized one, deletes the original
 * one because we dont need it and saves the url in the data object.
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} data this contains the preprocessed data made. The image url will be added to this
 */
async function saveImage(restaurantId, dishId, state, data) {
    const { ref, promise } = addDishImageFirestoreAPI(restaurantId, dishId, state.name, state.image.file);
    await promise;
    let url = await getDishImageURLFirestoreAPI(ref);
    url = convertURLTo320x240(url);
    return { ...data, image: url };
}

/**
 * This function is used for adding dishes to the backend. This creates the dishId as well
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addDishAPI = async (restaurantId, data, snackbar) => {
    const dishId = randomNumber();
    try {
        let newData = { ...data, restaurantReference: createRestaurantReference(restaurantId), reference: createDishReference(restaurantId, dishId), available: true, created: getCurrentDateTime() };
        if (data.image && data.image.file) {
            newData = await saveImage(restaurantId, dishId, newData, newData);
        } else {
            newData = { ...newData, image: newData.image.link };
        }
        await addDishFirestoreAPI(restaurantId, dishId, newData);
        snackbar(DishAdded, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorAddingDish, { variant: 'error' });
    }
};

/**
 * This function is used for adding dishes to the backend. This creates the dishId as well
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addDishesAPI = async (restaurantId, datas, snackbar) => {
    const dishIds = [];
    const newDatas = [];
    try {
        await Promise.all(datas.map(async (data) => {
            const dishId = randomNumber();
            const newData = { ...data, image: data.image.link, restaurantReference: createRestaurantReference(restaurantId), reference: createDishReference(restaurantId, dishId), available: true, created: getCurrentDateTime() };
            newDatas.push(newData);
            dishIds.push(dishId);
        }));
        await addDishesFirestoreAPI(restaurantId, dishIds.reverse(), newDatas.reverse());
        snackbar(DishesAdded, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorAddingDishes, { variant: 'error' });
    }
};

/**
 * Function used for updating dishes
 *
 * @param {*} restaurantId
 * @param {*} dishId
 * @param {*} data
 * @param {*} snackbar
 */
export const updateDishAPI = async (restaurantId, dishId, data, snackbar) => {
    try {
        let newData = {};
        if (data.image && data.image.file) {
            newData = await saveImage(restaurantId, dishId, data, data);
        } else {
            newData = { ...data, image: data.image.link };
        }
        await updateDishFirestoreAPI(restaurantId, dishId, newData);
        snackbar(DishUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingDish, { variant: 'error' });
    }
};

/**
 * Used for changing order of dishes
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} dishReferences id of the references of all dishes
 * @param {*} snackbar used for notifications
 */
export const changeDishOrderAPI = async (restaurantId, dishReferences, snackbar) => {
    try {
        await changeOrderOfDishesFirestoreAPI(restaurantId, dishReferences);
        snackbar(DishOrderChanged, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingDishOrder, { variant: 'error' });
    }
};

/**
 * When delete button is pressed this is called
 *
 * @param {*} restaurantId
 * @param {*} dishIds
 * @param {*} snackbar
 */
export const deleteSelectedDishesAPI = async (restaurantId, dishIds, snackbar) => {
    try {
        const categories = await fetchCategoriesFirestoreAPI(restaurantId);
        await deleteDishesFromArrayFirestoreAPI(restaurantId, dishIds, categories);
        snackbar(DishesDeleted, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorDeletingDishes, { variant: 'error' });
    }
};

export const updateDishesFromArrayAPI = async (restaurantId, dishIds, category, data, snackbar) => {
    try {
        await updateDishesFromArrayFirestoreAPI(restaurantId, dishIds, category, data);
        snackbar(DishesUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingDishes, { variant: 'error' });
    }
};
