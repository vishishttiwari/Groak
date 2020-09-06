/**
 * This component is used for the categories page
 */
import React, { useReducer, useEffect, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';
import arrayMove from 'array-move';
import SearchBar from 'material-ui-search-bar';
import Switch from '@material-ui/core/Switch';
import { context } from '../../../../globalState/globalState';

import './css/Categories.css';
import { fetchCategoriesAPI, changeAvailabilityOfCategoryAPI, changeCategoryOrderAPI } from './CategoriesAPICalls';
import Category from './category/Category';
import Heading from '../../../ui/heading/Heading';
import Spinner from '../../../ui/spinner/Spinner';
import { NoCategories, CategoryOrder, CategoriesNotFound } from '../../../../catalog/Comments';
import SortableList from '../../../dnd/SortableList';
import SortableItem from '../../../dnd/SortableItem';
import Empty from '../../../../assets/others/empty.png';

const initialState = { categories: [], searchField: '', changeOrder: false, loadingSpinner: true };

function reducer(state, action) {
    switch (action.type) {
        case 'fetchCategories':
            return { ...state, categories: action.categories, loadingSpinner: false };
        case 'setCategories':
            return { ...state, categories: action.categories, loadingSpinner: false };
        case 'setSearchField':
            return { ...state, searchField: action.searchField };
        case 'setChangeOrder':
            return { ...state, changeOrder: action.changeOrder };
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
            await fetchCategoriesAPI(globalState.restaurantPortalIdPortal, setState, enqueueSnackbar);
        }
        fetchCategories();
    }, [globalState.restaurantPortalIdPortal, enqueueSnackbar]);

    /**
     * This function is passed into the category component which is called everytime
     * the available button is pressed
     *
     * @param {*} changedCategory this is the category for which availability is changed
     */
    async function availableCategoryHandler(changedCategory) {
        await changeAvailabilityOfCategoryAPI(globalState.restaurantPortalIdPortal, state.categories, setState, changedCategory, enqueueSnackbar);
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
            await changeCategoryOrderAPI(globalState.restaurantPortalIdPortal, updatedCategories.map((category) => {
                return category.reference;
            }), enqueueSnackbar);
        }
    };

    /**
     * This function decides if dish is visble after writing something up in the search bar
     *
     * @param {*} dish
     */
    const isCategoryVisible = (category) => {
        if (!category) { return false; }
        if (state.searchField.length <= 0) { return true; }
        if (category.name && category.name.toLowerCase().startsWith(state.searchField.toLowerCase())) { return true; }
        if (category.name) {
            const categoryName = category.name.split(' ');
            for (let i = 0; i < categoryName.length; i += 1) {
                if (categoryName[i] && categoryName[i].toLowerCase().startsWith(state.searchField.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    };

    /**
     * This function is called when order toggle is pressed
     *
     * @param {*} checked
     */
    const orderToggle = (checked) => {
        setState({ type: 'setChangeOrder', changeOrder: checked });
    };

    return (
        <div className="categories">
            <Heading heading="Menu Categories" buttonName="Add Category" onClick={addCategoryHandler} />
            <Spinner show={state.loadingSpinner} />
            {!state.loadingSpinner ? (
                <>
                    <SearchBar
                        className="search-bar"
                        value={state.searchField}
                        onChange={(newValue) => {
                            setState({ type: 'setSearchField', searchField: newValue });
                        }}
                    />
                    {state.categories && state.categories.length === 0 ? (
                        <>
                            <p className="text-on-background">{NoCategories}</p>
                            <div className="not-found">
                                <p className="not-found-text">{CategoriesNotFound}</p>
                                <img className="not-found-image" draggable="false" src={Empty} alt="No Categories" />
                            </div>
                        </>
                    )
                        : (
                            <>
                                <p className="text-on-background">{CategoryOrder}</p>
                                <div className="order-change-toggle">
                                    <Switch
                                        checked={state.changeOrder}
                                        size="medium"
                                        onChange={(event) => { orderToggle(event.target.checked); }}
                                        name="changeOrder"
                                        inputProps={{ 'aria-label': 'primary checkbox' }}
                                        color="primary"
                                    />
                                    <p className="toggle-label">Change Order</p>
                                </div>
                            </>
                        )}
                    <SortableList axis="xy" onSortEnd={onSortEnd} distance={1} useWindowAsScrollContainer>
                        <div className="category-items">
                            {state.categories.map((category, index) => {
                                return (isCategoryVisible(category)
                                    ? (
                                        <SortableItem key={category.id} index={index} disabled={!state.changeOrder}>
                                            <Category
                                                categoryItem={category}
                                                availableCategoryHandler={availableCategoryHandler}
                                                clickHandler={() => { categoryDetailHandler(category.id); }}
                                            />
                                        </SortableItem>
                                    ) : null
                                );
                            })}
                        </div>
                    </SortableList>
                </>
            ) : null}
        </div>
    );
};

Categories.propTypes = {
    history: PropTypes.object.isRequired,
};

export default withRouter(Categories);
