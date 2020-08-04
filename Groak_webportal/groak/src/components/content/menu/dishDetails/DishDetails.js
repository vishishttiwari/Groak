/**
 * This component is used for the dish details page
 */
import React, { useEffect, useReducer, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import './css/DishDetails.css';
import { fetchDishAPI, addDishAPI, updateDishAPI, deleteDishAPI } from './DishDetailsAPICalls';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import DishImages from './DishImages';
import DishInformation from './DishInformation';
import DishNutritionalInformation from './DishNutritionalInformation';
import DishRestrictionInformation from './DishRestrictionInformation';
import DishIngredientsInformation from './DishIngredientsInformation';
import DishExtrasInformation from './dishExtrasInformation/DishExtrasInformation';
import DishDetailsMainButtons from './DishDetailsMainButtons';
import { NoDishTitle, InvalidDishPrice, InvalidDishNutritionalInfo, InvalidDishIngredients, InvalidDishExtras } from '../../../../catalog/NotificationsComments';

const initialState = {
    checkFields: false,
    newDish: true,
    image: { file: null, link: '' },
    name: '',
    price: '',
    shortInfo: '',
    description: '',
    calories: '',
    fats: '',
    protein: '',
    carbs: '',
    vegetarian: 'Not Sure',
    vegan: 'Not Sure',
    glutenFree: 'Not Sure',
    kosher: 'Not Sure',
    extras: [],
    ingredients: [],
    loadingSpinner: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setCheckFields':
            return { ...state, checkFields: action.checkFields };
        case 'setNewDish':
            return { ...state, newDish: action.newDish };
        case 'setImage':
            return { ...state, image: action.image };
        case 'setName':
            return { ...state, name: action.name };
        case 'setPrice':
            return { ...state, price: action.price };
        case 'setShortInfo':
            return { ...state, shortInfo: action.shortInfo };
        case 'setDescription':
            return { ...state, description: action.description };
        case 'setCalories':
            return { ...state, calories: action.calories };
        case 'setFats':
            return { ...state, fats: action.fats };
        case 'setProtein':
            return { ...state, protein: action.protein };
        case 'setCarbs':
            return { ...state, carbs: action.carbs };
        case 'setVegetarian':
            return { ...state, vegetarian: action.vegetarian };
        case 'setVegan':
            return { ...state, vegan: action.vegan };
        case 'setGlutenFree':
            return { ...state, glutenFree: action.glutenFree };
        case 'setKosher':
            return { ...state, kosher: action.kosher };
        case 'setExtras':
            return { ...state, extras: action.extras };
        case 'setIngredients':
            return { ...state, ingredients: action.ingredients };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'fetchDish':
            return { ...state,
                newDish: false,
                image: action.image,
                name: action.name,
                price: action.price,
                shortInfo: action.shortInfo,
                description: action.description,
                calories: action.calories,
                fats: action.fats,
                protein: action.protein,
                carbs: action.carbs,
                vegetarian: action.vegetarian,
                vegan: action.vegan,
                glutenFree: action.glutenFree,
                kosher: action.kosher,
                extras: action.extras,
                ingredients: action.ingredients,
                loadingSpinner: false };
        default:
            return initialState;
    }
}

const DishDetails = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    /**
     * This function is called at the start to fetch dish
     */
    useEffect(() => {
        async function fetchDish() {
            await fetchDishAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar);
        }
        if (match.params.id !== 'addDish' && match.params.id !== 'newDish') {
            fetchDish();
            setState({ type: 'setNewDish', newDish: false });
        } else {
            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        }
    }, [match.params.id, enqueueSnackbar, globalState.restaurantId]);

    /**
     * This function is used to check if all the calorie values enteres are correct.
     * This means all the calorie values are greater than 0.
     */
    function checkNutritionalFields() {
        if (parseFloat(state.calories) < 0) {
            return false;
        }
        if (parseFloat(state.carbs) < 0) {
            return false;
        }
        if (parseFloat(state.protein) < 0) {
            return false;
        }
        if (parseFloat(state.fats) < 0) {
            return false;
        }
        return true;
    }

    /**
     * This function is used to check if all the ingredients values are correct.
     * This means all the ingredients should have some text in them.
     */
    function checkIngredientsFields() {
        let valid = true;
        state.ingredients.forEach((ingredient) => {
            valid = valid && ingredient.title.length !== 0;
        });
        return valid;
    }

    /**
     * This function is used to check if all the extras fields are correct.
     * This means all the extras titles have text, max options are more or equal to min options
     * and prices are not negative.
     */
    function checkExtrasFields() {
        let valid = true;
        state.extras.forEach((extra) => {
            valid = valid && extra.title.length !== 0;
            extra.options.forEach((option) => {
                valid = valid && option.title.length !== 0;
                valid = valid && (!option.price || parseFloat(option.price)) >= 0;
            });
        });
        return valid;
    }

    /**
     * This function is called when the save/add changes button is pressed
     *
     * @param {*} event this is the event sent from the submit button
     */
    const submitHandler = async (event) => {
        event.preventDefault();
        setState({ type: 'setCheckFields', checkFields: true });
        if (state.name.length === 0) {
            enqueueSnackbar(NoDishTitle, { variant: 'error' });
            return;
        }
        if (parseFloat(state.price) < 0 || state.price.length === 0) {
            enqueueSnackbar(InvalidDishPrice, { variant: 'error' });
            return;
        }
        if (!checkNutritionalFields()) {
            enqueueSnackbar(InvalidDishNutritionalInfo, { variant: 'error' });
            return;
        }
        if (!checkIngredientsFields()) {
            enqueueSnackbar(InvalidDishIngredients, { variant: 'error' });
            return;
        }
        if (!checkExtrasFields()) {
            enqueueSnackbar(InvalidDishExtras, { variant: 'error' });
            return;
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        if (state.newDish) {
            await addDishAPI(globalState.restaurantId, state, enqueueSnackbar);
        } else {
            await updateDishAPI(globalState.restaurantId, match.params.id, state, enqueueSnackbar);
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        history.replace('/dishes');
    };

    /**
     * This function is called when delete button is pressed
     */
    const deleteHandler = async () => {
        if (!state.newDish) {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            await deleteDishAPI(globalState.restaurantId, match.params.id, enqueueSnackbar);
            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
            history.replace('/dishes');
        }
    };

    /**
     * This function is called to go back when the cancel button is pressed
     */
    const goBackHandler = () => {
        history.goBack();
    };

    return (
        <div className="dish-details">
            <Heading heading={state.newDish || state.name.length === 0 ? 'Dish Details' : state.name} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <form>
                    <DishImages image={state.image} name={state.name} setState={setState} />
                    <DishInformation checkFields={state.checkFields} name={state.name} price={state.price} shortInfo={state.shortInfo} description={state.description} setState={setState} />
                    <DishNutritionalInformation calories={state.calories} fats={state.fats} protein={state.protein} carbs={state.carbs} setState={setState} />
                    <DishRestrictionInformation vegetarian={state.vegetarian} vegan={state.vegan} glutenFree={state.glutenFree} kosher={state.kosher} setState={setState} />
                    <DishIngredientsInformation checkFields={state.checkFields} ingredients={state.ingredients} setState={setState} />
                    <DishExtrasInformation checkFields={state.checkFields} extras={state.extras} setState={setState} />
                    <DishDetailsMainButtons goBackHandler={goBackHandler} submitHandler={submitHandler} newDish={state.newDish} deleteHandler={deleteHandler} />
                </form>
            ) : null}
        </div>
    );
};

DishDetails.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(DishDetails));
