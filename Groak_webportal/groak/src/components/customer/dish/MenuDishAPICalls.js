import { fetchDishFirestoreAPI } from '../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { randomNumber } from '../../../catalog/Others';

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
export const fetchDishAPI = async (restaurantId, dishId, setState) => {
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
                    updatedExtra.minOptionsSelect = extra.minOptionsSelect ? extra.minOptionsSelect : 0;
                    updatedExtra.maxOptionsSelect = extra.maxOptionsSelect ? extra.maxOptionsSelect : extra.options.length;
                    updatedExtra.options = extra.options.map((option) => {
                        const updatedOption = { ...option, id: randomNumber() };
                        updatedOption.price = option.price ? option.price : -1;
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
                dish: {
                    id: doc.id,
                    reference: doc.data().reference,
                    name: doc.data().name ? doc.data().name : '',
                    price: doc.data().price ? doc.data().price : -1,
                    image: doc.data().image ? doc.data().image : '',
                    shortInfo: doc.data().shortInfo ? doc.data().shortInfo : '',
                    description: doc.data().description ? doc.data().description : '',
                    calories: doc.data().nutrition.calories ? doc.data().nutrition.calories : -1,
                    fats: doc.data().nutrition.fats ? doc.data().nutrition.fats : -1,
                    protein: doc.data().nutrition.protein ? doc.data().nutrition.protein : -1,
                    carbs: doc.data().nutrition.carbs ? doc.data().nutrition.carbs : -1,
                    vegetarian: doc.data().restrictions.vegetarian ? doc.data().restrictions.vegetarian : 'Not Sure',
                    vegan: doc.data().restrictions.vegan ? doc.data().restrictions.vegan : 'Not Sure',
                    glutenFree: doc.data().restrictions.glutenFree ? doc.data().restrictions.glutenFree : 'Not Sure',
                    kosher: doc.data().restrictions.kosher ? doc.data().restrictions.kosher : 'Not Sure',
                    extras: updatedExtras,
                    ingredients: updatedIngredients,
                },
            });
        } else {
            setState({ type: 'error' });
        }
    } catch (error) {
        setState({ type: 'error' });
    }
};
