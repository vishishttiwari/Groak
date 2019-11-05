/**
 * This component is used for the cetagories page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import { context } from '../../../../globalState/globalState';

import './css/Categories.css';
import { fetchCategoriesAPI, changeAvailabilityOfCategoryAPI, changeOrderOfCategoryToPriorAPI, changeOrderOfCategoryToNextAPI } from './CategoriesAPICalls';
import Category from './category/Category';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoCategories, CategoryOrder } from '../../../../catalog/Comments';

const initialState = { categories: [], loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchCategories':
            return { categories: action.categories, loadingSpinner: false };
        case 'setCategory':
            return { categories: action.categories, loadingSpinner: false };
        default:
            return state;
    }
}

const Categories = (props) => {
    const { history } = props;
    const [state, setState] = useReducer(reducer, initialState);
    const { globalState } = useContext(context);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        async function fetchCategories() {
            await fetchCategoriesAPI(globalState.restaurantId, setState, enqueueSnackbar);
        }
        fetchCategories();
    }, [globalState.restaurantId, enqueueSnackbar]);

    /**
     * This function is passed into the category component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedCategory this is the category for which availability is changed
     */
    async function availableCategoryHandler(changedCategory) {
        await changeAvailabilityOfCategoryAPI(globalState.restaurantId, state.categories, setState, changedCategory, enqueueSnackbar);
    }

    /**
     * This function is used to change the order of a card that has to be moved before
     *
     * @param {*} event this is used for stopping propgation so that card is not pressed when the button is pressed
     * @param {*} order this contains the order that has to be moved left
     */
    async function changeOrderOfCategoryToPrior(event, order, index) {
        event.stopPropagation();
        await changeOrderOfCategoryToPriorAPI(state.categories, setState, order, index, enqueueSnackbar);
    }

    /**
     * This function is used to change the order of a card that has to be moved next
     *
     * @param {*} event this is used for stopping propgation so that card is not pressed when the button is pressed
     * @param {*} order this contains the order that has to be moved right
     */
    async function changeOrderOfCategoryToNext(event, order, index) {
        event.stopPropagation();
        await changeOrderOfCategoryToNextAPI(state.categories, setState, order, index, enqueueSnackbar);
    }

    /**
     * This function is called to add a category. This function is passed to the heading
     */
    function addCategoryHandler() {
        history.push('/categories/addCategory');
    }

    /**
     * This function is called when each category is pressed.
     *
     * @param {*} id this is the id of the category that is passed
     */
    function categoryDetailHandler(id) {
        history.push(`/categories/${id}`);
    }

    return (
        <div className="categories">
            <Heading heading="Categories" buttonName="Add Category" onClick={addCategoryHandler} />
            <Spinner show={state.loadingSpinner} />
            {state.categories && state.categories.length !== 0 ? <p className="text-on-background">{CategoryOrder}</p> : null}
            {!state.loadingSpinner ? (
                <div className="category-items">
                    {state.categories && state.categories.length === 0 ? <p className="text-on-background">{NoCategories}</p> : null}
                    {state.categories.map((category, index) => {
                        return (
                            <Category
                                key={category.id}
                                categoryItem={category}
                                availableCategoryHandler={availableCategoryHandler}
                                index={index}
                                movePrior={changeOrderOfCategoryToPrior}
                                moveNext={changeOrderOfCategoryToNext}
                                clickHandler={() => { categoryDetailHandler(category.id); }}
                            />
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
};

Categories.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(Categories);
