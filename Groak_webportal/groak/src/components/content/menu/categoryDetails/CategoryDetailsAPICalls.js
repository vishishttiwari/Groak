/**
 * This class includes categories details related functions such as fetching category, updating category etc.
 */
import { fetchCategoryFirestoreAPI, addCategoryFirestoreAPI, updateCategoryFirestoreAPI, deleteCategoryFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { DemoCategoryStartTime, DemoCategoryEndTime } from '../../../../catalog/Demo';
import { ErrorFetchingCategory, ErrorAddingCategory, ErrorUpdatingCategory, ErrorDeletingCategory, CategoryNotFound, CategoryUpdated, CategoryDeleted, CategoryAdded } from '../../../../catalog/NotificationsComments';
import { fetchQRCodesFromCollectionFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';

/**
 * This is used for fetching the dishes
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setDishes this is used for setting the dishes array
 * @param {*} snackbar used for notifications
 */
export const fetchDishesAPI = async (restaurantId, setState, snackbar) => {
    const newDishesMap = new Map();
    const newDishes = [];
    try {
        const docs = await fetchDishesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            newDishesMap.set(doc.data().reference.path, { id: doc.id, ...doc.data() });
            newDishes.push({ id: doc.id, ...doc.data() });
        });
        setState({ type: 'setAllDishes', allDishes: newDishes, allDishesMap: newDishesMap });
    } catch (error) {
        snackbar(ErrorFetchingCategory, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function fetches the data from server, then converts it into a form that
 * the component will understand. This includes converting numbers into string,
 * adding keys to extras and ingredients so that the map can show it correctly.
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} categoryId id of the category that needs to be fetched
 * @param {*} setState this is used for setting the state of component with correct information
 * @param {*} snackbar this is used for notifications
 */
export const fetchCategoryAPI = async (restaurantId, categoryId, setState, snackbar) => {
    const days = { sunday: false, monday: false, tuesday: false, wednesday: false, thursday: false, friday: false, saturday: false };
    try {
        const data = await fetchCategoryFirestoreAPI(restaurantId, categoryId);

        // If the category exists then get the data
        if (data.exists) {
            // If days exists then get which days are active
            const newDays = { ...days };
            if (data.data().days) {
                data.data().days.forEach((day) => {
                    newDays[day] = true;
                });
            }
            // Get dishes in this category and add it to selected dishes
            let dishesPath = [];
            if (data.data().dishes) {
                dishesPath = data.data().dishes.map((dish) => {
                    return dish.path;
                });
            }
            setState({
                type: 'fetchCategory',
                name: data.data().name ? data.data().name : '',
                startTime: (data.data().startTime || data.data().startTime === 0) ? data.data().startTime : DemoCategoryStartTime,
                endTime: data.data().endTime ? data.data().endTime : DemoCategoryEndTime,
                days: newDays,
                selectedDishesPath: dishesPath,
            });
        } else {
            snackbar(CategoryNotFound, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        snackbar(ErrorFetchingCategory, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for adding categories to the backend. This creates the categoryId as well
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} newCategoryId id of the category that needs to be added
 * @param {*} newCategory this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addCategoryAPI = async (restaurantId, newCategoryId, newCategory, snackbar) => {
    try {
        await addCategoryFirestoreAPI(restaurantId, newCategoryId, newCategory);
        snackbar(CategoryAdded, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorAddingCategory, { variant: 'error' });
    }
};

/**
 * This function updates a category
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} categoryId id of the category that needs to be fetched
 * @param {*} changedCategory this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const updateCategoryAPI = async (restaurantId, categoryId, changedCategory, snackbar) => {
    try {
        await updateCategoryFirestoreAPI(restaurantId, categoryId, changedCategory);
        snackbar(CategoryUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingCategory, { variant: 'error' });
    }
};

/**
 * This function deletes a category
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} categoryId id of the category that needs to be fetched
 * @param {*} snackbar this is used for notifications
 */
export const deleteCategoryAPI = async (restaurantId, categoryId, snackbar) => {
    try {
        const qrCodes = await fetchQRCodesFromCollectionFirestoreAPI(restaurantId);
        await deleteCategoryFirestoreAPI(restaurantId, categoryId, qrCodes);
        snackbar(CategoryDeleted, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorDeletingCategory, { variant: 'error' });
    }
};
