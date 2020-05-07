/**
 * This class includes categories details related functions such as fetching category, updating category etc.
 */
import { fetchCategoryFirestoreAPI, fetchCategoriesFirestoreAPI, addCategoryFirestoreAPI, updateCategoryFirestoreAPI, deleteCategoryFirestoreAPI, createCategoryReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishesFirestoreAPI, createDishReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { getCurrentDateTime } from '../../../../firebase/FirebaseLibrary';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { DemoCategoryStartTime, DemoCategoryEndTime } from '../../../../catalog/Demo';
import { randomNumber } from '../../../../catalog/Others';
import { ErrorFetchingCategory, ErrorAddingCategory, ErrorUpdatingCategory, ErrorDeletingCategory, CategoryNotFound } from '../../../../catalog/NotificationsComments';

/**
 * This function gets the information from the component's state and then converts it into
 * a format that the backend will understand. This includes converting numbers from strings to actual numbers,
 * converting extras and ingredients to objects without the keys as the keys are not required in the backend.
 *
 * @param {*} state this stores the information saved in the state of component
 */
function preProcessData(restaurantId, state) {
    const newDays = [];
    Object.keys(state.days).forEach((day) => {
        if (state.days[day]) {
            newDays.push(day);
        }
    });
    const newDishes = [];
    state.selectedDishes.forEach((dish) => {
        newDishes.push(createDishReference(restaurantId, dish));
    });
    return {
        name: state.name,
        startTime: state.startTime,
        endTime: state.endTime,
        days: newDays,
        dishes: newDishes,
    };
}

/**
 * This is used for fetching the dishes
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setDishes this is used for setting the dishes array
 * @param {*} snackbar used for notifications
 */
export const fetchDishesAPI = async (restaurantId, setState, snackbar) => {
    const newDishes = [];
    try {
        const docs = await fetchDishesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            newDishes.push({ id: doc.id, ...doc.data() });
        });
        setState({ type: 'setAllDishes', allDishes: newDishes });
    } catch (error) {
        snackbar(ErrorFetchingCategory, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function fetches the data from server, then converts it into a form that
 * the component will understand. This includes coonverting numbers into string,
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
            const newSelectedDishes = [];
            if (data.data().dishes) {
                data.data().dishes.forEach((dish) => {
                    newSelectedDishes.push(dish.path.split('/').pop());
                });
            }
            setState({
                type: 'fetchCategory',
                name: data.data().name ? data.data().name : '',
                startTime: data.data().startTime ? data.data().startTime : DemoCategoryStartTime,
                endTime: data.data().endTime ? data.data().endTime : DemoCategoryEndTime,
                days: newDays,
                selectedDishes: newSelectedDishes,
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
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addCategoryAPI = async (restaurantId, state, snackbar) => {
    const categoryId = randomNumber();
    try {
        let data = preProcessData(restaurantId, state);
        const { docs } = await fetchCategoriesFirestoreAPI(restaurantId);
        let order = -1;
        if (docs.length !== 0) {
            order = docs.slice(-1).pop().data().order;
        }
        data = { order: order + 1, restaurantReference: createRestaurantReference(restaurantId), reference: createCategoryReference(restaurantId, categoryId), available: true, created: getCurrentDateTime(), ...data };
        await addCategoryFirestoreAPI(restaurantId, categoryId, data);
    } catch (error) {
        snackbar(ErrorAddingCategory, { variant: 'error' });
    }
};

/**
 * This function updates a category
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} categoryId id of the category that needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const updateCategoryAPI = async (restaurantId, categoryId, state, snackbar) => {
    const data = preProcessData(restaurantId, state);
    try {
        await updateCategoryFirestoreAPI(restaurantId, categoryId, data);
    } catch (error) {
        snackbar(ErrorUpdatingCategory, { variant: 'error' });
    }
};

/**
 * This function updates a category specifically the selected dishes. If a selected dishes is found
 * that has actually been deleted then this function is called to delete the dish from selected dishes
 * of this category
 *
 * @param {*} restaurantId id of the restaurant for which category needs to be fetched
 * @param {*} categoryId id of the category that needs to be fetched
 * @param {*} selectedDishes these are the ids of the dishes that will become the new selected dishes in this category
 * @param {*} snackbar this is used for notifications
 */
export const updateSelectedDishesInCategoryAPI = async (restaurantId, categoryId, selectedDishes, snackbar) => {
    try {
        const newSelectedDishes = [];
        selectedDishes.forEach((dish) => {
            newSelectedDishes.push(createDishReference(restaurantId, dish));
        });
        await updateCategoryFirestoreAPI(restaurantId, categoryId, { dishes: newSelectedDishes });
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
        await deleteCategoryFirestoreAPI(restaurantId, categoryId);
    } catch (error) {
        snackbar(ErrorDeletingCategory, { variant: 'error' });
    }
};
