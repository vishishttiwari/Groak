/**
 * This class includes restaurant related functions such as fetching a restaurant or updating a restaurant
 */
import { updateRestaurantFirestoreAPI, addRestaurantLogoFirestoreAPI, getRestaurantLogoURLFirestoreAPI, addRestaurantImageFirestoreAPI, getRestaurantImageURLFirestoreAPI, fetchRestaurantFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { ErrorUpdatingRestaurant, MissingDishesFound, MissingDishesNotFound, SettingsUpdated, ErrorFetchingMissingDishes, MissingCategoriesFound, MissingCategoriesNotFound, ErrorFetchingMissingCategories, MissingQRCodesNotFound, MissingQRCodesFound } from '../../../catalog/NotificationsComments';
import { fetchDishesFromCollectionFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { fetchCategoriesFromCollectionFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { fetchQRCodesFromCollectionFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsQRCodes';

/**
 * This function first checks if an image needs to be uploaded. If yes then it uploads image, then gets the reference,
 * then updates the restaurant with image and other information. If image doe snot need to be updated then it
 * just updates the restauarnt with necessary information.
 *
 * @param {*} restaurantId restaurant ID
 * @param {*} data this is the new data
 * @param {*} logo this logo is the logo of the restaurant
 * @param {*} setState sets the state of the current page
 * @param {*} snackbar used for notifications
 */
export const updateRestaurantAPI = async (restaurantId, data, logo, image, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });

    try {
        let updatedData;

        // If logo is updated then upload logo and add url to the data
        if (logo && logo.file) {
            const { ref, promise } = addRestaurantLogoFirestoreAPI(restaurantId, data.name, logo.file);
            await promise;
            const url = await getRestaurantLogoURLFirestoreAPI(ref);
            updatedData = { ...data, logo: url };
        } else {
            updatedData = { ...data, logo: logo.link };
        }

        // If image is updated then upload image and add url to the data
        if (image && image.file) {
            const { refImage, promiseImage } = addRestaurantImageFirestoreAPI(restaurantId, data.name, image.file);
            await promiseImage;
            const urlImage = await getRestaurantImageURLFirestoreAPI(refImage);

            updatedData = { ...updatedData, image: urlImage };
        } else {
            updatedData = { ...updatedData, image: image.link };
        }

        await updateRestaurantFirestoreAPI(restaurantId, updatedData);
        setGlobalState({ type: 'setRestaurantPortal', restaurant: updatedData, restaurantId });
        snackbar(SettingsUpdated, { variant: 'success' });
    } catch (error) {
        snackbar(ErrorUpdatingRestaurant, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};

/**
 * Because this dishes are saved as an array in restaurant doc, sometimes the array might lose few dishes.
 * This function goes through all the dishes in the dishes collection, find any dishes that ae not in
 * restaurant doc and adds them to it
 *
 * @param {*} restaurantId
 * @param {*} setState
 * @param {*} setGlobalState
 * @param {*} snackbar
 */
export const addMissingDishes = async (restaurantId, data, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        const dishReferences = [];
        const dishPaths = [];
        let initialCount = 0;

        const restaurantDoc = await fetchRestaurantFirestoreAPI(restaurantId);
        if (restaurantDoc.exists && restaurantDoc.data() && restaurantDoc.data().dishes) {
            const { dishes } = restaurantDoc.data();
            dishes.forEach((dish) => {
                dishReferences.push(dish);
                dishPaths.push(dish.path);
            });
        }

        initialCount = dishReferences.length;

        await fetchDishesFromCollectionFirestoreAPI(restaurantId)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!dishPaths.includes(doc.data().reference.path)) {
                        dishReferences.push(doc.data().reference);
                    }
                });
            })
            .catch(() => {
                snackbar(ErrorFetchingMissingDishes, { variant: 'error' });
            });
        if (initialCount !== dishReferences.length) {
            const updatedData = { dishes: dishReferences };
            await updateRestaurantFirestoreAPI(restaurantId, updatedData);
            setGlobalState({ type: 'setRestaurantPortal', restaurant: { ...data, dishes: dishReferences }, restaurantId });
            snackbar(MissingDishesFound, { variant: 'success' });
        } else {
            snackbar(MissingDishesNotFound, { variant: 'info' });
        }
    } catch (error) {
        snackbar(ErrorFetchingMissingDishes, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};

/**
 * Because this categories are saved as an array in restaurant doc, sometimes the array might lose few categories.
 * This function goes through all the categories in the categories collection, finds any categories that ae not in
 * restaurant doc and adds them to it
 *
 * @param {*} restaurantId
 * @param {*} setState
 * @param {*} setGlobalState
 * @param {*} snackbar
 */
export const addMissingCategories = async (restaurantId, data, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        const categoryReferences = [];
        const categoryPaths = [];
        let initialCount = 0;

        const restaurantDoc = await fetchRestaurantFirestoreAPI(restaurantId);
        if (restaurantDoc.exists && restaurantDoc.data() && restaurantDoc.data().categories) {
            const { categories } = restaurantDoc.data();
            categories.forEach((category) => {
                categoryReferences.push(category);
                categoryPaths.push(category.path);
            });
        }

        initialCount = categoryReferences.length;

        await fetchCategoriesFromCollectionFirestoreAPI(restaurantId)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!categoryPaths.includes(doc.data().reference.path)) {
                        categoryReferences.push(doc.data().reference);
                    }
                });
            })
            .catch(() => {
                snackbar(ErrorFetchingMissingCategories, { variant: 'error' });
            });
        if (initialCount !== categoryReferences.length) {
            const updatedData = { categories: categoryReferences };
            await updateRestaurantFirestoreAPI(restaurantId, updatedData);
            setGlobalState({ type: 'setRestaurantPortal', restaurant: { ...data, categories: categoryReferences }, restaurantId });
            snackbar(MissingCategoriesFound, { variant: 'success' });
        } else {
            snackbar(MissingCategoriesNotFound, { variant: 'info' });
        }
    } catch (error) {
        snackbar(ErrorFetchingMissingCategories, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};

/**
 * Because this qr codes are saved as an array in restaurant doc, sometimes the array might lose few qr codes.
 * This function goes through all the qr codes in the qr codes collection, finds any qr codes that ae not in
 * restaurant doc and adds them to it
 *
 * @param {*} restaurantId
 * @param {*} setState
 * @param {*} setGlobalState
 * @param {*} snackbar
 */
export const addMissingQRCodes = async (restaurantId, data, setState, setGlobalState, snackbar) => {
    setState({ type: 'setLoadingSpinner', loadingSpinner: true });
    try {
        const qrCodeReferences = [];
        const qrCodePaths = [];
        let initialCount = 0;

        const restaurantDoc = await fetchRestaurantFirestoreAPI(restaurantId);
        if (restaurantDoc.exists && restaurantDoc.data() && restaurantDoc.data().qrCodes) {
            const { qrCodes } = restaurantDoc.data();
            qrCodes.forEach((qrCode) => {
                qrCodeReferences.push(qrCode);
                qrCodePaths.push(qrCode.path);
            });
        }

        initialCount = qrCodeReferences.length;

        await fetchQRCodesFromCollectionFirestoreAPI(restaurantId)
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    if (!qrCodePaths.includes(doc.data().reference.path)) {
                        qrCodeReferences.push(doc.data().reference);
                    }
                });
            })
            .catch(() => {
                snackbar(ErrorFetchingMissingCategories, { variant: 'error' });
            });
        if (initialCount !== qrCodeReferences.length) {
            const updatedData = { qrCodes: qrCodeReferences };
            await updateRestaurantFirestoreAPI(restaurantId, updatedData);
            setGlobalState({ type: 'setRestaurantPortal', restaurant: { ...data, qrCodes: qrCodeReferences }, restaurantId });
            snackbar(MissingQRCodesFound, { variant: 'success' });
        } else {
            snackbar(MissingQRCodesNotFound, { variant: 'info' });
        }
    } catch (error) {
        snackbar(ErrorFetchingMissingCategories, { variant: 'error' });
    }
    setState({ type: 'setLoadingSpinner', loadingSpinner: false });
};
