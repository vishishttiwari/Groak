/**
 * This class includes fetching categories and dishes in each categories
 */
import { fetchCategoriesWithConditionsFirestoreAPI, fetchCategoryFirestoreAPI } from '../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishFirestoreAPI } from '../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchRestaurantFirestoreAPI } from '../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingCategories, ErrorFetchingCategory, CategoryNotFound, DishNotFound, ErrorFetchingDish, NotFoundRestaurant } from '../../catalog/NotificationsComments';
import { getMinutesFromMidnight } from '../../catalog/TimesDates';

/**
 * Function used to get restaurant name and restaurant logo
 *
 * @param {*} restaurantId
 * @param {*} snacbar
 */
export const fetchRestaurantAPI = async (restaurantId, snackbar) => {
    try {
        const doc = await fetchRestaurantFirestoreAPI(restaurantId);

        if (doc.exists) {
            return doc.data();
        }
        snackbar(NotFoundRestaurant, { variant: 'error' });
        return {};
    } catch (error) {
        snackbar(NotFoundRestaurant, { variant: 'error' });
        return {};
    }
};

/**
 * This function fetches the data from server, then converts it into a form that
 * the component will understand. This includes coonverting numbers into string,
 * adding keys to extras and ingredients so that the map can show it correctly.
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} setState this is used for setting the state of component with correct information
 * @param {*} snackbar this is used for notifications
 */
export const fetchDishAPI = async (restaurantId, dishId, snackbar) => {
    try {
        const doc = await fetchDishFirestoreAPI(restaurantId, dishId);

        // Check if such a dish exists
        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        snackbar(DishNotFound, { variant: 'error' });
        return {};
    } catch (error) {
        snackbar(ErrorFetchingDish, { variant: 'error' });
        return {};
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
export const fetchCategoryAPI = async (restaurantId, categoryId, snackbar) => {
    try {
        const data = await fetchCategoryFirestoreAPI(restaurantId, categoryId);

        // If the category exists then get the data
        if (data.exists) {
            // Get dishes in this category and add it to selected dishes
            const newSelectedDishes = [];
            if (data.data().dishes) {
                data.data().dishes.forEach((dish) => {
                    if (data.data().endTime > getMinutesFromMidnight() && data.data().available) {
                        newSelectedDishes.push(dish.path.split('/').pop());
                    }
                });
            }
            return newSelectedDishes;
        }
        snackbar(CategoryNotFound, { variant: 'error' });
        return [];
    } catch (error) {
        snackbar(ErrorFetchingCategory, { variant: 'error' });
        return [];
    }
};

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, setState, snackbar) => {
    const categories = [];
    const categoryNames = new Map();
    const fullCategories = new Map();
    const menuItems = new Map();
    try {
        const docs = await fetchCategoriesWithConditionsFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            categories.push({ id: doc.id, ...doc.data() });
            categoryNames.set(doc.id, doc.data().name);
            fullCategories.set(doc.id, []);
            menuItems.set(doc.id, []);
        });
        const restaurant = await fetchRestaurantAPI(restaurantId, snackbar);
        await Promise.allSettled(categories.map(async (category) => {
            const fullCategory = await fetchCategoryAPI(restaurantId, category.id, snackbar);
            if (fullCategory.length > 0) {
                fullCategories.set(category.id, fullCategory);
            } else {
                categoryNames.delete(category.id);
                fullCategories.delete(category.id);
                menuItems.delete(category.id);
            }
        }));
        await Promise.allSettled(Array.from(fullCategories.keys()).map(async (categoryId) => {
            const dishes = fullCategories.get(categoryId);
            let dishArray = new Array(dishes.length);
            await Promise.allSettled(dishes.map(async (dish, index) => {
                dishArray[index] = await fetchDishAPI(restaurantId, dish, snackbar);
            }));
            dishArray = dishArray.filter((dish) => { return dish.available; });
            if (dishArray.length > 0) {
                menuItems.set(categoryId, dishArray);
            } else {
                categoryNames.delete(categoryId);
                fullCategories.delete(categoryId);
                menuItems.delete(categoryId);
            }
        }));
        if (categoryNames.size === 0 || menuItems.size === 0) {
            setState({ type: 'error' });
        } else {
            setState({ type: 'fetchMenuItems', menuItems, categoryNames, restaurant });
        }
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
};
