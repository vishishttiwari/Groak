/**
 * This class includes categories related functions such as fetching all categories and changing the availability of category etc.
 */
import { fetchCategoriesFirestoreAPI, updateCategoryFirestoreAPI, changeOrderOfDishesFirestoreAPI, deleteCategoriesFromArrayFirestoreAPI, updateCategoriesFromArrayFirestoreAPI, addCategoriesFirestoreAPI, createCategoryReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { ErrorFetchingCategories, ErrorChangingAvailability, ErrorChangingCategoryOrder, CategoryOrderChanged, CategoryUpdated, CategoriesDeleted, ErrorDeletingCategories, CategoriesUpdated, ErrorUpdatingCategories, ErrorUpdatingCategory, CategoriesAdded, ErrorAddingCategories } from '../../../../catalog/NotificationsComments';
import { randomNumber } from '../../../../catalog/Others';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { getCurrentDateTime } from '../../../../firebase/FirebaseLibrary';

/**
 * This function is used for adding categories to the backend. This creates the dishId as well
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addCategoriesAPI = async (restaurantId, datas, snackbar) => {
    const categoryIds = [];
    const newDatas = [];
    try {
        await Promise.all(datas.map(async (data) => {
            const categoryId = randomNumber();
            const newData = { restaurantReference: createRestaurantReference(restaurantId), reference: createCategoryReference(restaurantId, categoryId), available: true, created: getCurrentDateTime(), ...data };
            newDatas.push(newData);
            categoryIds.push(categoryId);
        }));
        await addCategoriesFirestoreAPI(restaurantId, categoryIds.reverse(), newDatas.reverse());
        snackbar(CategoriesAdded, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorAddingCategories, { variant: 'error' });
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
    const newCategories = [];
    try {
        const docs = await fetchCategoriesFirestoreAPI(restaurantId);
        docs.forEach((doc) => {
            if (doc.exists) {
                newCategories.push({ id: doc.id, ...doc.data() });
            }
        });
        setState({ type: 'fetchCategories', categories: newCategories });
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

/**
 * When delete button is pressed this is called
 *
 * @param {*} restaurantId
 * @param {*} categoryIds
 * @param {*} snackbar
 */
export const deleteSelectedCategoriesAPI = async (restaurantId, categoryIds, snackbar) => {
    try {
        const categories = await fetchCategoriesFirestoreAPI(restaurantId);
        await deleteCategoriesFromArrayFirestoreAPI(restaurantId, categoryIds, categories);
        snackbar(CategoriesDeleted, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorDeletingCategories, { variant: 'error' });
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

export const updateCategoriesFromArrayAPI = async (restaurantId, categoryIds, category, data, snackbar) => {
    try {
        await updateCategoriesFromArrayFirestoreAPI(restaurantId, categoryIds, category, data);
        snackbar(CategoriesUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingCategories, { variant: 'error' });
    }
};
