/**
 * This class includes fetching categories and dishes in each categories
 */
import { fetchCategoriesFromArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchDishesFromArrayFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorFetchingCategories } from '../../../catalog/NotificationsComments';
import { fetchQRCodeFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';
import { checkCategoryAvailability, checkQRCodeAvailability, checkDishAvailability } from '../../../catalog/Others';

/**
 * Function used to get restaurant name and restaurant logo
 *
 * @param {*} restaurantId
 * @param {*} snacbar
 */
export const fetchRestaurantAPI = async (restaurantId) => {
    try {
        const doc = await fetchRestaurantFirestoreAPI(restaurantId);

        if (doc.exists) {
            return { id: doc.id, ...doc.data() };
        }
        return {};
    } catch (error) {
        return {};
    }
};

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, qrCodeId, dontCheckAvailability, setState, snackbar) => {
    const categories = [];
    const categoryItems = new Map();
    const menuItems = new Map();

    try {
        const restaurant = await fetchRestaurantAPI(restaurantId);
        const data = await fetchQRCodeFirestoreAPI(restaurantId, qrCodeId);

        if (data.exists && data.data()) {
            if (dontCheckAvailability || checkQRCodeAvailability(data.data())) {
                const docs = await fetchCategoriesFromArrayFirestoreAPI(data.data().categories);

                docs.forEach((doc) => {
                    if (doc.exists) {
                        const category = { id: doc.id, ...doc.data() };
                        if (dontCheckAvailability || checkCategoryAvailability(category)) {
                            categories.push(category);
                            categoryItems.set(doc.id, category.name);
                            menuItems.set(doc.id, []);
                        }
                    }
                });

                await Promise.all(categories.map(async (category) => {
                    const docs1 = await fetchDishesFromArrayFirestoreAPI(category.dishes);
                    const dishes = [];
                    docs1.forEach((doc) => {
                        if (doc.exists) {
                            const dish = { id: doc.id, ...doc.data() };
                            if (dontCheckAvailability || checkDishAvailability(dish)) {
                                dishes.push(dish);
                            }
                        }
                    });
                    menuItems.set(category.id, dishes);
                }));
                if (categories.length === 0) {
                    setState({ type: 'categoriesNotFound' });
                } else {
                    setState({ type: 'fetchMenuItems', categoryItems, menuItems, restaurant });
                }
            } else {
                setState({ type: 'categoriesNotFound' });
            }
        } else {
            setState({ type: 'restaurantNotFound' });
        }
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
};
