/**
 * This class includes dishes details related functions such as fetching dish, updating dish etc.
 */
import { fetchDishFirestoreAPI, addDishFirestoreAPI, deleteDishFirestoreAPI, addDishImageFirestoreAPI, updateDishFirestoreAPI, getDishImageURLFirestoreAPI, createDishReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { getCurrentDateTime } from '../../../../firebase/FirebaseLibrary';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { fetchCategoriesFirestoreAPI } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';
import { randomNumber } from '../../../../catalog/Others';
import { ErrorFetchingDish, DishNotFound, ErrorAddingDish, ErrorUpdatingDish, ErrorDeletingDish } from '../../../../catalog/NotificationsComments';

/**
 * This function gets the information from the component's state and then converts it into
 * a format that the backend will understand. This includes converting numbers from strings to actual numbers,
 * converting extras and ingredients to objects without the keys as the keys are not required in the backend.
 *
 * @param {*} state this stores the information saved in the state of component
 */
function preProcessData(state) {
    const updatedExtras = state.extras.map((extra) => {
        const updatedExtra = { ...extra };
        delete updatedExtra.id;
        updatedExtra.minOptionsSelect = extra.minOptionsSelect ? parseFloat(extra.minOptionsSelect) : 0;
        updatedExtra.maxOptionsSelect = extra.maxOptionsSelect ? parseFloat(extra.maxOptionsSelect) : updatedExtra.options.length;
        updatedExtra.options = extra.options.map((option) => {
            const updatedOption = { ...option };
            delete updatedOption.id;
            updatedOption.price = option.price ? parseFloat(option.price) : 0;
            return updatedOption;
        });
        return updatedExtra;
    });
    const updatedIngredients = state.ingredients.map((ingredient) => {
        return ingredient.title;
    });
    return {
        name: state.name,
        price: parseFloat(state.price),
        shortInfo: state.shortInfo,
        description: state.description,
        nutrition: {
            calories: state.calories ? parseFloat(state.calories) : 0,
            fats: state.fats ? parseFloat(state.fats) : 0,
            protein: state.protein ? parseFloat(state.protein) : 0,
            carbs: state.carbs ? parseFloat(state.carbs) : 0,
        },
        restrictions: {
            vegetarian: state.vegetarian,
            vegan: state.vegan,
            glutenFree: state.glutenFree,
            kosher: state.kosher,
        },
        ingredients: updatedIngredients,
        extras: updatedExtras,
    };
}

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
 * This function fetches the data from server, then converts it into a form that
 * the component will understand. This includes coonverting numbers into string,
 * adding keys to extras and ingredients so that the map can show it correctly.
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} setState this is used for setting the state of component with correct information
 * @param {*} snackbar this is used for notifications
 */
export const fetchDishAPI = async (restaurantId, dishId, setState, snackbar) => {
    try {
        const doc = await fetchDishFirestoreAPI(restaurantId, dishId);

        // Check if such a dish exists
        if (doc.exists) {
            let updatedExtras = [];
            let updatedIngredients = [];

            // If extras exists then break it into a form that the component will understand. This includes adding key for map
            if (doc.data().extras) {
                updatedExtras = doc.data().extras.map((extra) => {
                    const updatedExtra = { ...extra, id: randomNumber() };
                    updatedExtra.minOptionsSelect = extra.minOptionsSelect ? extra.minOptionsSelect.toString() : '';
                    updatedExtra.maxOptionsSelect = extra.maxOptionsSelect ? extra.maxOptionsSelect.toString() : '';
                    updatedExtra.options = extra.options.map((option) => {
                        const updatedOption = { ...option, id: randomNumber() };
                        updatedOption.price = option.price ? option.price.toString() : '';
                        return updatedOption;
                    });
                    return updatedExtra;
                });
            }

            // If ingredients exists then break it into a form that the component will understand. This includes adding key for map
            if (doc.data().ingredients) {
                updatedIngredients = doc.data().ingredients.map((ingredient) => {
                    return { id: randomNumber(), title: ingredient };
                });
            }
            setState({
                type: 'fetchDish',
                name: doc.data().name ? doc.data().name : '',
                price: doc.data().price ? doc.data().price.toString() : '',
                image: doc.data().image ? { file: null, link: doc.data().image } : { file: null, link: '' },
                shortInfo: doc.data().shortInfo ? doc.data().shortInfo : '',
                description: doc.data().description ? doc.data().description : '',
                calories: doc.data().nutrition.calories ? doc.data().nutrition.calories.toString() : '',
                fats: doc.data().nutrition.fats ? doc.data().nutrition.fats.toString() : '',
                protein: doc.data().nutrition.protein ? doc.data().nutrition.protein.toString() : '',
                carbs: doc.data().nutrition.carbs ? doc.data().nutrition.carbs.toString() : '',
                vegetarian: doc.data().restrictions.vegetarian ? doc.data().restrictions.vegetarian : 'Not Sure',
                vegan: doc.data().restrictions.vegan ? doc.data().restrictions.vegan : 'Not Sure',
                glutenFree: doc.data().restrictions.glutenFree ? doc.data().restrictions.glutenFree : 'Not Sure',
                kosher: doc.data().restrictions.kosher ? doc.data().restrictions.kosher : 'Not Sure',
                extras: updatedExtras,
                ingredients: updatedIngredients,
            });
        } else {
            snackbar(DishNotFound, { variant: 'error' });
            setState({ type: 'error' });
        }
    } catch (error) {
        snackbar(ErrorFetchingDish, { variant: 'error' });
        setState({ type: 'error' });
    }
};

/**
 * This function is used for adding dishes to the backend. This creates the dishId as well
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const addDishAPI = async (restaurantId, state, snackbar) => {
    const dishId = randomNumber();
    try {
        let data = preProcessData(state);
        data = { restaurantReference: createRestaurantReference(restaurantId), reference: createDishReference(restaurantId, dishId), available: true, created: getCurrentDateTime(), ...data };
        if (state.image && state.image.file) {
            data = await saveImage(restaurantId, dishId, state, data);
        } else {
            data = { ...data, image: state.image.link };
        }
        await addDishFirestoreAPI(restaurantId, dishId, data);
    } catch (error) {
        snackbar(ErrorAddingDish, { variant: 'error' });
    }
};

/**
 * This function updates a dish along with the image
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} state this stores the information saved in the state of component
 * @param {*} snackbar this is used for notifications
 */
export const updateDishAPI = async (restaurantId, dishId, state, snackbar) => {
    let data = preProcessData(state);
    try {
        if (state.image && state.image.file) {
            data = await saveImage(restaurantId, dishId, state, data);
        } else {
            data = { ...data, image: state.image.link };
        }
        await updateDishFirestoreAPI(restaurantId, dishId, data);
    } catch (error) {
        snackbar(ErrorUpdatingDish, { variant: 'error' });
    }
};

/**
 * This function deletes a dish. This also calls a function that goes through every category and deletes this dish
 * from there.
 *
 * @param {*} restaurantId id of the restaurant for which dish needs to be fetched
 * @param {*} dishId id of the dish that needs to be fetched
 * @param {*} snackbar this is used for notifications
 */
export const deleteDishAPI = async (restaurantId, dishId, snackbar) => {
    try {
        const categories = await fetchCategoriesFirestoreAPI(restaurantId);
        await deleteDishFirestoreAPI(restaurantId, dishId, categories);
    } catch (error) {
        snackbar(ErrorDeletingDish, { variant: 'error' });
    }
};
