/**
 * This component is used for the category details page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import './css/CategoryDetails.css';
import { fetchDishesAPI, fetchCategoryAPI, addCategoryAPI, updateCategoryAPI, deleteCategoryAPI, updateSelectedDishesInCategoryAPI } from './CategoryDetailsAPICalls';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import CategoryTitle from './CategoryTitle';
import CategoryDays from './CategoryDays';
import CategoryTimes from './CategoryTimes';
import CategorySelectedDishes from './categoryDishes/CategorySelectedDishes';
import CategoryUnselectedDishes from './categoryDishes/CategoryUnselectedDishes';
import CategoryDetailsMainButtons from './CategoryDetailsMainButtons';
import { NoCategoryTitle } from '../../../../catalog/NotificationsComments';
import { DemoCategoryStartTime, DemoCategoryEndTime } from '../../../../catalog/Demo';

const initialState = {
    checkFields: false,
    newCategory: true,
    name: '',
    startTime: DemoCategoryStartTime,
    endTime: DemoCategoryEndTime,
    days: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
    },
    selectedDishes: [],
    allDishes: [],
    loadingSpinner: true,
};

function reducer(state, action) {
    switch (action.type) {
        case 'setCheckFields':
            return { ...state, checkFields: action.checkFields };
        case 'setNewCategory':
            return { ...state, newCategory: action.newCategory };
        case 'setName':
            return { ...state, name: action.name };
        case 'setStartTime':
            return { ...state, startTime: action.startTime };
        case 'setEndTime':
            return { ...state, endTime: action.endTime };
        case 'setDays':
            return { ...state, days: action.days };
        case 'setSelectedDishes':
            return { ...state, selectedDishes: action.selectedDishes };
        case 'setAllDishes':
            return { ...state, allDishes: action.allDishes, loadingSpinner: false };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'fetchCategory':
            return { ...state,
                name: action.name,
                startTime: action.startTime,
                endTime: action.endTime,
                days: action.days,
                selectedDishes: action.selectedDishes,
                loadingSpinner: false,
            };
        default:
            return initialState;
    }
}

const CategoryDetails = (props) => {
    const { history, match } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchCategory() {
            await fetchCategoryAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar);
        }
        async function fetchDishes() {
            await fetchDishesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        if (match.params.id !== 'addCategory' && match.params.id !== 'newCategory') {
            fetchDishes();
            fetchCategory();
            setState({ type: 'setNewCategory', newCategory: false });
        } else {
            fetchDishes();
        }
    }, [match.params.id, enqueueSnackbar, globalState.restaurantId]);

    /**
     * This function is called when the save/add changes button is pressed
     *
     * @param {*} event this is the event sent from the submit button
     */
    const submitHandler = async (event) => {
        event.preventDefault();
        setState({ type: 'setCheckFields', checkFields: true });
        if (state.name.length === 0) {
            enqueueSnackbar(NoCategoryTitle, { variant: 'error' });
            return;
        }
        setState({ type: 'setLoadingSpinner', loadingSpinner: true });
        if (state.newCategory) {
            await addCategoryAPI(globalState.restaurantId, state, enqueueSnackbar);
        } else {
            await updateCategoryAPI(globalState.restaurantId, match.params.id, state, enqueueSnackbar);
        }
        history.goBack();
        setState({ type: 'setLoadingSpinner', loadingSpinner: false });
    };

    /**
     * This function is called whenever a dish is selected or deselected both in selected dish and unselected
     * dishes.
     *
     * @param {*} event this tells if topic was checked or unchecked
     * @param {*} id this tells which dish was checked or unchecked
     */
    const checkDishHandler = (event, id) => {
        let newSelectedDishes = [...state.selectedDishes];
        if (event.target.checked) {
            newSelectedDishes.push(id);
        } else {
            newSelectedDishes = newSelectedDishes.filter((dish) => {
                return (dish !== id);
            });
        }
        setState({ type: 'setSelectedDishes', selectedDishes: newSelectedDishes });
    };

    /**
     * This function is used for moving a selected dish prior by changing the dishes array.
     *
     * @param {*} index of element which needs to be moved prior
     */
    const moveDishPrior = (index) => {
        if (index !== 0 && state.selectedDishes.length !== 0 && state.selectedDishes.length !== 1) {
            const newSelectedDishes = [...state.selectedDishes];
            const priorDish = newSelectedDishes[index - 1];
            const currentDish = newSelectedDishes[index];
            newSelectedDishes[index] = priorDish;
            newSelectedDishes[index - 1] = currentDish;
            setState({ type: 'setSelectedDishes', selectedDishes: newSelectedDishes });
        }
    };

    /**
     * This function is used for moving a selected dish next by changing the dishes array.
     *
     * @param {*} index of element which needs to be moved next
     */
    const moveDishNext = (index) => {
        if (index !== (state.selectedDishes.length - 1) && state.selectedDishes.length !== 0 && state.selectedDishes.length !== 1) {
            const newSelectedDishes = [...state.selectedDishes];
            const nextDish = newSelectedDishes[index + 1];
            const currentDish = newSelectedDishes[index];
            newSelectedDishes[index] = nextDish;
            newSelectedDishes[index + 1] = currentDish;
            setState({ type: 'setSelectedDishes', selectedDishes: newSelectedDishes });
        }
    };

    /**
     * This function is used in case there is a dish that has been deleted but has not been deleted from this category.
     * If such a dish is found in this category that actually does not exist in dishes because it was dishes, then this
     * function updates the dishes of this categry with new dishes that does not include this new dish.
     *
     * @param {*} id of the dish that needs to be deleted
     */
    const updateDishesInCategory = (id) => {
        const newSelectedDishes = state.selectedDishes.filter((dish) => {
            return (dish !== id);
        });
        updateSelectedDishesInCategoryAPI(globalState.restaurantId, match.params.id, newSelectedDishes, enqueueSnackbar);
    };

    /**
     * This function is called when delete button is pressed
     */
    const deleteHandler = async () => {
        if (!state.newCategory) {
            setState({ type: 'setLoadingSpinner', loadingSpinner: true });
            await deleteCategoryAPI(globalState.restaurantId, match.params.id, enqueueSnackbar);
            history.goBack();
            setState({ type: 'setLoadingSpinner', loadingSpinner: false });
        }
    };

    /**
     * This function is called to go back when the cancel button is pressed
     */
    const goBackHandler = () => {
        history.goBack();
    };

    return (
        <div className="category-details">
            <Heading heading={state.newCategory || state.name.length === 0 ? 'Category Details' : state.name} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <form>
                    <CategoryTitle checkFields={state.checkFields} name={state.name} setState={setState} />
                    <CategoryDays days={state.days} setState={setState} />
                    <CategoryTimes startTime={state.startTime} endTime={state.endTime} setState={setState} />
                    <CategorySelectedDishes selectedDishes={state.selectedDishes} allDishes={state.allDishes} checkDishHandler={checkDishHandler} moveDishPrior={moveDishPrior} moveDishNext={moveDishNext} updateDishesInCategory={updateDishesInCategory} />
                    <CategoryUnselectedDishes selectedDishes={state.selectedDishes} allDishes={state.allDishes} checkDishHandler={checkDishHandler} />
                    <CategoryDetailsMainButtons goBackHandler={goBackHandler} submitHandler={submitHandler} newCategory={state.newCategory} deleteHandler={deleteHandler} />
                </form>
            ) : null}
        </div>
    );
};

CategoryDetails.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
};

export default withRouter(React.memo(CategoryDetails));
