/**
 * This component is used for the category details page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';
import { createCategoryReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsCategories';

import './css/CategoryDetails.css';
import { fetchDishesAPI, fetchCategoryAPI, addCategoryAPI, updateCategoryAPI, deleteCategoryAPI } from './CategoryDetailsAPICalls';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import CategoryTitle from './CategoryTitle';
import CategoryDays from './CategoryDays';
import CategorySelectedDishes from './categoryDishes/CategorySelectedDishes';
import CategoryUnselectedDishes from './categoryDishes/CategoryUnselectedDishes';
import CategoryDetailsMainButtons from './CategoryDetailsMainButtons';
import { NoCategoryTitle } from '../../../../catalog/NotificationsComments';
import { DemoCategoryStartTime, DemoCategoryEndTime } from '../../../../catalog/Demo';
import { createDishReferenceFromPath } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsDishes';
import { getCurrentDateTime } from '../../../../firebase/FirebaseLibrary';
import { createRestaurantReference } from '../../../../firebase/FirestoreAPICalls/FirestoreAPICallsRestaurants';
import { randomNumber } from '../../../../catalog/Others';

const initialState = {
    checkFields: false,
    newCategory: true,
    name: '',
    startTime: {
        sunday: DemoCategoryStartTime,
        monday: DemoCategoryStartTime,
        tuesday: DemoCategoryStartTime,
        wednesday: DemoCategoryStartTime,
        thursday: DemoCategoryStartTime,
        friday: DemoCategoryStartTime,
        saturday: DemoCategoryStartTime,
    },
    endTime: {
        sunday: DemoCategoryEndTime,
        monday: DemoCategoryEndTime,
        tuesday: DemoCategoryEndTime,
        wednesday: DemoCategoryEndTime,
        thursday: DemoCategoryEndTime,
        friday: DemoCategoryEndTime,
        saturday: DemoCategoryEndTime,
    },
    days: {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
    },
    selectedDishesPath: [],
    allDishes: [],
    allDishesMap: new Map(),
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
        case 'setSelectedDishesPath':
            return { ...state, selectedDishesPath: action.selectedDishesPath };
        case 'setAllDishes':
            return { ...state, allDishes: action.allDishes, allDishesMap: action.allDishesMap, loadingSpinner: false };
        case 'setLoadingSpinner':
            return { ...state, loadingSpinner: action.loadingSpinner };
        case 'fetchCategory':
            return { ...state,
                name: action.name,
                startTime: action.startTime,
                endTime: action.endTime,
                days: action.days,
                selectedDishesPath: action.selectedDishesPath,
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

    /**
     * Used for creating a qr code object whensaving or updating
     */
    const createCategory = (categoryId) => {
        const newDays = [];
        Object.keys(state.days).forEach((day) => {
            if (state.days[day]) {
                newDays.push(day);
            }
        });
        return {
            restaurantReference: createRestaurantReference(globalState.restaurantId),
            reference: createCategoryReference(globalState.restaurantId, categoryId),
            available: true,
            created: getCurrentDateTime(),
            name: state.name,
            startTime: state.startTime,
            endTime: state.endTime,
            days: newDays,
            dishes: state.selectedDishesPath.map((dishPath) => {
                return createDishReferenceFromPath(dishPath);
            }),
        };
    };

    useEffect(() => {
        async function fetchCategoryAndDishes() {
            await Promise.all([await fetchCategoryAPI(globalState.restaurantId, match.params.id, setState, enqueueSnackbar), await fetchDishesAPI(globalState.restaurantId, setState, enqueueSnackbar)]);
        }
        async function fetchDishes() {
            await fetchDishesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        if (match.params.id !== 'addCategory' && match.params.id !== 'newCategory') {
            fetchCategoryAndDishes();
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
            const categoryId = randomNumber();
            await addCategoryAPI(globalState.restaurantId, categoryId, createCategory(categoryId), enqueueSnackbar);
        } else {
            await updateCategoryAPI(globalState.restaurantId, match.params.id, createCategory(match.params.id), enqueueSnackbar);
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
    const checkDishHandler = (event, path) => {
        let newSelectedDishesPath = [...state.selectedDishesPath];
        if (event.target.checked) {
            newSelectedDishesPath.push(path);
        } else {
            newSelectedDishesPath = newSelectedDishesPath.filter((dish) => {
                return (dish !== path);
            });
        }
        setState({ type: 'setSelectedDishesPath', selectedDishesPath: newSelectedDishesPath });
    };

    /**
     * This is used when dish's position is changed
     *
     * @param {*} dishes categories with updated order
     */
    const changeDishPositionHandler = (dishes) => {
        setState({ type: 'setSelectedDishesPath', selectedDishesPath: dishes });
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
                    <CategoryDays days={state.days} startTime={state.startTime} endTime={state.endTime} setState={setState} />
                    <CategorySelectedDishes selectedDishesPath={state.selectedDishesPath} allDishesMap={state.allDishesMap} checkDishHandler={checkDishHandler} changeDishPositionHandler={changeDishPositionHandler} />
                    <CategoryUnselectedDishes selectedDishesPath={state.selectedDishesPath} allDishes={state.allDishes} checkDishHandler={checkDishHandler} />
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
