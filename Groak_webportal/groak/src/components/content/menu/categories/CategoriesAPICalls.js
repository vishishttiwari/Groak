/**
 * This class includes categories related functions such as fetching all categories and changing the availability of category etc.
 */
import { fetchCategoriesFirestoreAPI, changeOrderOfCategoryFirestoreAPI, updateCategoryFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { ErrorFetchingCategories, ErrorChangingAvailability, ErrorChangingOrderOfCategory } from '../../../../catalog/NotificationsComments';

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
            newCategories.push({ id: doc.id, ...doc.data() });
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
        setState({ type: 'setCategory',
            categories: categories.map((category) => {
                if (category.id !== finalCategory.id) { return category; }
                return finalCategory;
            }),
        });
    } catch (error) {
        snackbar(ErrorChangingAvailability, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is called when a category has to be moved prior
 *
 * @param {*} categories categories array
 * @param {*} setState this is used for setting the categories array
 * @param {*} order the index of the category that needs to be moved prior
 * @param {*} snackbar used for notifications
 */
export const changeOrderOfCategoryToPriorAPI = async (categories, setState, order, index, snackbar) => {
    try {
        if (index > 0) {
            const updatedCategories = [...categories];
            const categoryToBeMovedPrior = { ...updatedCategories[index] };
            const categoryToBeMovedNext = { ...updatedCategories[index - 1] };
            await changeOrderOfCategoryFirestoreAPI(categoryToBeMovedPrior, categoryToBeMovedNext);
            const categoryToBeMovedPriorOrder = categoryToBeMovedPrior.order;
            const categoryToBeMovedNextOrder = categoryToBeMovedNext.order;
            categoryToBeMovedPrior.order = categoryToBeMovedNextOrder;
            categoryToBeMovedNext.order = categoryToBeMovedPriorOrder;
            updatedCategories[index] = categoryToBeMovedNext;
            updatedCategories[index - 1] = categoryToBeMovedPrior;
            setState({ type: 'setCategory', categories: updatedCategories });
        }
    } catch (error) {
        snackbar(ErrorChangingOrderOfCategory, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is called when a category has to be moved next
 *
 * @param {*} categories categories array
 * @param {*} setState this is used for setting the categories array
 * @param {*} order the index of the category that needs to be moved next
 * @param {*} snackbar used for notifications
 */
export const changeOrderOfCategoryToNextAPI = async (categories, setState, order, index, snackbar) => {
    try {
        if (index < (categories.length - 1)) {
            const updatedCategories = [...categories];
            const categoryToBeMovedNext = { ...updatedCategories[index] };
            const categoryToBeMovedPrior = { ...updatedCategories[index + 1] };
            await changeOrderOfCategoryFirestoreAPI(categoryToBeMovedPrior, categoryToBeMovedNext);
            const categoryToBeMovedPriorOrder = categoryToBeMovedPrior.order;
            const categoryToBeMovedNextOrder = categoryToBeMovedNext.order;
            categoryToBeMovedNext.order = categoryToBeMovedPriorOrder;
            categoryToBeMovedPrior.order = categoryToBeMovedNextOrder;
            updatedCategories[index] = categoryToBeMovedPrior;
            updatedCategories[index + 1] = categoryToBeMovedNext;
            setState({ type: 'setCategory', categories: updatedCategories });
        }
    } catch (error) {
        snackbar(ErrorChangingOrderOfCategory, { variant: 'error' });
        setState({ type: 'error' });
    }
};
