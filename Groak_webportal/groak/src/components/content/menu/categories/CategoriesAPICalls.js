/**
 * This class includes categories related functions such as fetching all categories and changing the availability of category etc.
 */
import { fetchCategoriesFirestoreAPI, updateCategoryFirestoreAPI, changeOrderOfDishesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { ErrorFetchingCategories, ErrorChangingAvailability, ErrorChangingCategoryOrder, CategoryOrderChanged, CategoryUpdated } from '../../../../catalog/NotificationsComments';

/**
 * This is used for fetching the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} setState this is used for setting the categories array
 * @param {*} snackbar used for notifications
 */
export const fetchCategoriesAPI = async (restaurantId, setState, snackbar) => {
    try {
        const docs = await fetchCategoriesFirestoreAPI(restaurantId);
        setState({ type: 'fetchCategories',
            categories: docs.map((doc) => {
                return { id: doc.id, ...doc.data() };
            }) });
    } catch (error) {
        snackbar(ErrorFetchingCategories, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This is used for changing the availabilty of the categories
 *
 * @param {*} restaurantId restaurantId
 * @param {*} categories categories array
 * @param {*} setState this is used for setting the categories array
 * @param {*} changedCategory this is the category for which the availability is being changed
 * @param {*} snackbar used for notifications
 */
export const changeAvailabilityOfCategoryAPI = async (restaurantId, categories, setState, changedCategory, snackbar) => {
    const finalCategory = { ...changedCategory };
    try {
        await updateCategoryFirestoreAPI(restaurantId, finalCategory.id, { available: finalCategory.available });
        setState({ type: 'setCategories',
            categories: categories.map((category) => {
                if (category.id !== finalCategory.id) { return category; }
                return finalCategory;
            }),
        });
        snackbar(CategoryUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingAvailability, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * Used for changing order of categories
 *
 * @param {*} restaurantId id of the restaurant
 * @param {*} categoryReferences id of the references of all categories
 * @param {*} snackbar used for notifications
 */
export const changeCategoryOrderAPI = async (restaurantId, categoryReferences, snackbar) => {
    try {
        await changeOrderOfDishesFirestoreAPI(restaurantId, categoryReferences);
        snackbar(CategoryOrderChanged, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorChangingCategoryOrder, { variant: 'error' });
    }
};
