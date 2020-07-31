/**
 * This component is used for the categories page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import { context } from '../../../../globalState/globalState';

import './css/Categories.css';
import { fetchCategoriesAPI, changeAvailabilityOfCategoryAPI, changeCategoryOrderAPI } from './CategoriesAPICalls';
import Category from './category/Category';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoCategories, CategoryOrder } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';

const initialState = { categories: [], loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchCategories':
            return { categories: action.categories, loadingSpinner: false };
        case 'setCategories':
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

    /**
     * This function is called when drag and drop has ended
     *
     * @param {*} param0
     */
    const onSortEnd = async ({ oldIndex, newIndex }) => {
        if (oldIndex !== newIndex) {
            const updatedCategories = arrayMove(state.categories, oldIndex, newIndex);
            setState({ type: 'setCategories',
                categories: updatedCategories,
            });
            await changeCategoryOrderAPI(globalState.restaurantId, updatedCategories.map((category) => {
                return category.reference;
            }), enqueueSnackbar);
        }
    };

    return (
        <div className="categories">
            <Heading heading="Menu Categories" buttonName="Add Category" onClick={addCategoryHandler} />
            <Spinner show={state.loadingSpinner} />
            {state.categories && state.categories.length !== 0 ? <p className="text-on-background">{CategoryOrder}</p> : null}
            {!state.loadingSpinner ? (
                <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                    <div className="category-items">
                        {state.categories && state.categories.length === 0 ? <p className="text-on-background">{NoCategories}</p> : null}
                        {state.categories.map((category, index) => {
                            return (
                                <SortableItem key={category.id} index={index}>
                                    <Category
                                        categoryItem={category}
                                        availableCategoryHandler={availableCategoryHandler}
                                        clickHandler={() => { categoryDetailHandler(category.id); }}
                                    />
                                </SortableItem>
                            );
                        })}
                    </div>
                </SortableList>
            ) : null}
        </div>
    );
};

Categories.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(Categories);
